/**
 * logic.js
 * Core application logic, Search pipeline, and UI Interaction.
 */

// DOM Helper
const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MASTER_DATA === 'undefined') return alert("Missing data.js");
    
    // 1. Pre-process data for search (Performance Optimization)
    STATE.data = MASTER_DATA.map(place => {
        place._searchKey = SearchUtils.normalize(place.name);
        return place;
    });

    // 2. Initialize Subsystems
    MapUtils.init();
    DataUtils.plot();
    UIUtils.init();
});

const SearchUtils = {
    /**
     * Normalizes a string for "Fuzzy" matching.
     * Rules: Lowercase, flatten accents, dashes->spaces, remove ignored punctuation.
     */
    normalize: (str) => {
        if (!str) return '';
        let s = str.toLowerCase();
        s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Flatten accents
        s = s.replace(/\bsaint\b/g, 'st').replace(/\bsainte\b/g, 'ste'); // Standardize prefixes
        s = s.replace(/-/g, ' ');   // Dashes to spaces
        s = s.replace(/['.]/g, ''); // Strip punctuation
        return s.replace(/\s+/g, ' ').trim();
    },

    /**
     * Calculates a match score (0-100).
     * @param {Object} place - The data object
     * @param {String} flatQuery - The normalized user input
     * @param {String} rawQuery - The raw user input (lowercased)
     */
    getScore: (place, flatQuery, rawQuery) => {
        const normName = place._searchKey;
        const rawName = place.name.toLowerCase();

        // Tier 1: User typed exact characters (Highest Priority)
        // e.g. User typed "St-A" -> matches "St-André" better than "St. André"
        if (rawName.startsWith(rawQuery)) return 100;
        if (rawName.includes(rawQuery)) return 80;

        // Tier 2: Normalized matches (Fallback)
        // e.g. User typed "st andre" -> matches "St-André"
        if (normName.startsWith(flatQuery)) return 60;
        if (normName.includes(flatQuery)) return 40;

        return 0;
    }
};

const DataUtils = {
    getCat: (p) => {
        if (String(p.isFirstNation) === "true") return 'fn';
        if (p.microListed === true) return 'micro';
        if (p.shortListed === true) return 'short';
        return 'full';
    },

    getStatusText: (cat) => {
        const labels = {
            fn: "First Nation, included in <b><u>all lists</u></b>",
            micro: "Included in <b><u>all lists</u></b>",
            short: "Included in <b><u>short</u></b> and <b><u>full lists</u></b>",
            full: "Included in <b><u>full-list</u></b> only"
        };
        return labels[cat] || "Unknown";
    },
    
    plot: () => {
        STATE.data.forEach(place => {
            if (!place.latitude) return;
            
            const cat = DataUtils.getCat(place);
            STATE.stats[cat]++;
            STATE.lookup.set(`${place.name}|${place.province}`, place);

            const cfg = CONFIG.categories[cat];
            
            // Create Marker
            const marker = L.circleMarker([place.latitude, place.longitude], {
                radius: cfg.radius, fillColor: cfg.color, 
                color: "#fff", weight: 1.5, fillOpacity: 0.9,
                pane: `pane-${cat}`
            }).bindPopup(() => DataUtils.getPopupContent(place, cat));

            STATE.layers[cat].addLayer(marker);
        });
        
        // Update Legend Counts
        Object.keys(STATE.stats).forEach(k => {
            const el = $(`count-${k}`);
            if(el) el.textContent = STATE.stats[k].toLocaleString();
        });
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

                // Filter -> Score -> Sort -> Slice -> Map
                const hits = STATE.data
                    .filter(p => p._searchKey.includes(flatQuery)) 
                    .map(p => ({ p, score: SearchUtils.getScore(p, flatQuery, rawQuery) }))
                    .sort((a, b) => b.score - a.score) 
                    .slice(0, 50)
                    .map(item => item.p);

                if (!hits.length) return;

                drop.style.display = 'block';
                drop.innerHTML = hits.map(p => {
                    const cat = DataUtils.getCat(p);
                    const key = `${p.name}|${p.province}`;
                    return `<div class="suggestion-item" data-key="${key}" data-cat="${cat}">
                        <span class="search-dot bg-${cat}"></span>
                        <div><strong>${p.name}</strong>, <span style="color:#666">${p.province}</span></div>
                    </div>`;
                }).join('');
            }, 150); // Debounce
        });

        drop.addEventListener('click', e => {
            const item = e.target.closest('.suggestion-item');
            if (!item) return;
            
            const place = STATE.lookup.get(item.dataset.key);
            const cat = item.dataset.cat;
            input.value = place.name;
            drop.style.display = 'none';
            
            // Ensure layer is visible
            if (!STATE.map.hasLayer(STATE.layers[cat])) {
                STATE.map.addLayer(STATE.layers[cat]);
                $(`legend-${cat}`).classList.remove('disabled');
            }
            // Zoom to location (MarkerCluster handles unspiderfying if needed)
            STATE.map.setView([place.latitude, place.longitude], 16); 
        });

        // Close dropdown when clicking outside
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
                    if(hint) hint.remove(); // Remove hint on first interaction
                    
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
        
        // Setup generator buttons if the Utils exist
        if (typeof GeneratorUtils !== 'undefined') {
            ['places-full', 'places-short', 'places-micro', 'names-full', 'names-short', 'names-micro'].forEach(type => {
                const btn = $(`btn-${type}`);
                if(btn) btn.addEventListener('click', () => GeneratorUtils.export(type, STATE.data));
            });
        }
    }
};