/**
 * logic.js
 * Core application logic, Search pipeline, and UI Interaction.
 */

// DOM Helper
const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MASTER_DATA === 'undefined') return alert("Missing data.js");
    
    // 1. Pre-process data: Add search normalization AND a runtime ID for collisions
    STATE.data = MASTER_DATA.map((place, index) => {
        place._id = index; // Unique Runtime ID to handle name collisions
        place._searchKey = SearchUtils.normalize(place.name);
        return place;
    });

    // 2. Initialize Subsystems
    MapUtils.init();
    DataUtils.plot();
    UIUtils.init();
});

const SearchUtils = {
    normalize: (str) => {
        if (!str) return '';
        let s = str.toLowerCase();
        s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 
        s = s.replace(/\bsaint\b/g, 'st').replace(/\bsainte\b/g, 'ste'); 
        s = s.replace(/-/g, ' ');   
        s = s.replace(/['.]/g, ''); 
        return s.replace(/\s+/g, ' ').trim();
    },

    getScore: (place, flatQuery, rawQuery) => {
        const normName = place._searchKey;
        const rawName = place.name.toLowerCase();
        if (rawName.startsWith(rawQuery)) return 100;
        if (rawName.includes(rawQuery)) return 80;
        if (normName.startsWith(flatQuery)) return 60;
        if (normName.includes(flatQuery)) return 40;
        return 0;
    }
};

const DataUtils = {
    getCat: (p) => {
        // Exclusive Category Logic for Layering
        if (p.Indigenous === true || String(p.Indigenous) === "true") return 'indig';
        if (p.microListed === true) return 'micro';
        if (p.shortListed === true) return 'short';
        return 'full';
    },

    getStatusText: (cat) => {
        const labels = {
            indig: "Indigenous, included in <b><u>all lists</u></b>",
            micro: "Included in <b><u>all lists</u></b>",
            short: "Included in <b><u>short</u></b> and <b><u>full lists</u></b>",
            full: "Included in <b><u>full-list</u></b> only"
        };
        return labels[cat] || "Unknown";
    },
    
    plot: () => {
        // Reset stats counts
        STATE.stats = { indig: 0, micro: 0, short: 0, full: 0 };

        STATE.data.forEach(place => {
            if (!place.latitude) return;
            
            const cat = DataUtils.getCat(place);
            STATE.stats[cat]++; // Increment exclusive category count
            
            // Add to Map Layer
            STATE.lookup.set(`${place.name}|${place.province}`, place);
            const cfg = CONFIG.categories[cat];
            
            const marker = L.circleMarker([place.latitude, place.longitude], {
                radius: cfg.radius, fillColor: cfg.color, 
                color: "#fff", weight: 1.5, fillOpacity: 0.9,
                pane: `pane-${cat}`
            }).bindPopup(() => DataUtils.getPopupContent(place, cat));

            STATE.layers[cat].addLayer(marker);
        });
        
        // --- Calculate Cumulative Counts for Legend ---
        const countIndig = STATE.stats.indig;
        const countMicro = STATE.stats.indig + STATE.stats.micro;
        const countShort = STATE.stats.indig + STATE.stats.micro + STATE.stats.short;
        const countFull  = STATE.stats.indig + STATE.stats.micro + STATE.stats.short + STATE.stats.full; // Total

        // Update Legend DOM
        const setTxt = (id, num) => { const el = $(id); if(el) el.textContent = num.toLocaleString(); };
        
        setTxt('count-indig', countIndig);
        setTxt('count-micro', countMicro);
        setTxt('count-short', countShort);
        setTxt('count-full', countFull);
    },

    getPopupContent: (p, cat) => {
        const prov = PROVINCES[p.province] || p.province;
        const status = DataUtils.getStatusText(cat);
        const lat = p.latitude.toFixed(4);
        const lng = p.longitude.toFixed(4);
        const url = `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;

        return `
            <div style="font-size:14px; line-height:1.4; min-width:220px;">
                <strong>${p.name}</strong><br>
                <span style="color:#666;">${prov}</span>
                <hr style="margin:8px 0; border:0; border-top:1px solid #eee;">
                <div class="popup-status">${status}</div>
                <div class="popup-coords">${lat}, ${lng}</div>
                <a href="${url}" target="_blank" class="btn-popup">🧭 Fact check coords</a>
            </div>`;
    }
};

const UIUtils = {
    init: () => {
        UIUtils.initSearch();
        UIUtils.initLayers();
        UIUtils.initLegend();
        UIUtils.initGenerator();
    },

    initSearch: () => {
        const input = $('searchInput');
        const drop = $('searchSuggestions');
        let timer;
        
        input.addEventListener('input', e => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const rawVal = e.target.value;
                drop.innerHTML = ''; drop.style.display = 'none';
                if (rawVal.length < 2) return;

                const rawQuery = rawVal.toLowerCase();
                const flatQuery = SearchUtils.normalize(rawVal);

                const hits = STATE.data
                    .filter(p => p._searchKey.includes(flatQuery)) 
                    .map(p => ({ p, score: SearchUtils.getScore(p, flatQuery, rawQuery) }))
                    .sort((a, b) => {
                        // 1. Sort by Relevance Score
                        if (b.score !== a.score) return b.score - a.score;
                        
                        // 2. Sort by Hierarchy (Indig > Micro > Short > Full)
                        // Note: DataUtils.getCat returns 'indig', 'micro', 'short', 'full'
                        const rank = { 'indig': 4, 'micro': 3, 'short': 2, 'full': 1 };
                        const catA = DataUtils.getCat(a.p);
                        const catB = DataUtils.getCat(b.p);
                        if (rank[catA] !== rank[catB]) return rank[catB] - rank[catA];

                        // 3. Sort Alphabetically
                        return a.p.name.localeCompare(b.p.name);
                    }) 
                    .slice(0, 50)
                    .map(item => item.p);

                if (!hits.length) return;

                drop.style.display = 'block';
                drop.innerHTML = hits.map(p => {
                    const cat = DataUtils.getCat(p);
                    // Use runtime ID (_id) for robust collision handling
                    return `<div class="suggestion-item" data-id="${p._id}" data-cat="${cat}">
                        <span class="search-dot bg-${cat}"></span>
                        <div><strong>${p.name}</strong>, <span style="color:#666">${p.province}</span></div>
                    </div>`;
                }).join('');
            }, 150);
        });

        drop.addEventListener('click', e => {
            const item = e.target.closest('.suggestion-item');
            if (!item) return;
            
            const place = STATE.data[item.dataset.id];
            const cat = item.dataset.cat;
            
            input.value = place.name;
            drop.style.display = 'none';
            
            if (!STATE.map.hasLayer(STATE.layers[cat])) {
                STATE.map.addLayer(STATE.layers[cat]);
                $(`legend-${cat}`).classList.remove('disabled');
            }
            STATE.map.setView([place.latitude, place.longitude], 16); 
        });

        document.addEventListener('click', e => {
            if (!input.contains(e.target) && !drop.contains(e.target)) drop.style.display = 'none';
        });
    },

    initLayers: () => {
        const menu = $('layerMenu');
        $('layerBtn').addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('show'); });
        document.addEventListener('click', () => menu.classList.remove('show'));
        
        document.querySelectorAll('.layer-option').forEach(opt => opt.addEventListener('click', () => {
            document.querySelectorAll('.layer-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            $('currentLayerName').textContent = opt.textContent;
            MapUtils.setBase(opt.dataset.layer);
        }));
    },

    initLegend: () => {
        Object.keys(CONFIG.categories).forEach(cat => {
            const el = $(`legend-${cat}`);
            if(el) {
                el.addEventListener('click', function() {
                    const hint = $('legend-hint');
                    if(hint) hint.remove(); 
                    
                    if (STATE.map.hasLayer(STATE.layers[cat])) {
                        STATE.map.removeLayer(STATE.layers[cat]);
                        this.classList.add('disabled');
                    } else {
                        STATE.map.addLayer(STATE.layers[cat]);
                        this.classList.remove('disabled');
                    }
                });
            }
        });
    },

    initGenerator: () => {
        const header = $('genHeader');
        if (header) {
            header.addEventListener('click', () => $('generatorMenu').classList.toggle('expanded'));
        }
        if (typeof GeneratorUtils !== 'undefined') {
            ['places-full', 'places-short', 'places-micro', 'names-full', 'names-short', 'names-micro'].forEach(type => {
                const btn = $(`btn-${type}`);
                if(btn) btn.addEventListener('click', () => GeneratorUtils.export(type, STATE.data));
            });
        }
    }
};