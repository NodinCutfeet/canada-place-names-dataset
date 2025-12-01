/**
 * map.js
 * Handles Map initialization, Clustering, and Layer management.
 * Relies on CONFIG and STATE from config.js
 */

const MapUtils = {
    init: () => {
        // 1. Define Base Tiles
        STATE.tiles = {
            satellite: L.layerGroup([
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { pane: 'overlayPane' })
            ]),
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
            light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png')
        };

        // 2. Initialize Map
        STATE.map = L.map('map', { 
            zoomControl: false, 
            layers: [STATE.tiles.satellite], // Default layer
            minZoom: CONFIG.minZoom,
            maxZoom: CONFIG.maxZoom, 
            maxBounds: CONFIG.maxBounds,
            maxBoundsViscosity: 1.0,
            attributionControl: false 
        }).setView(CONFIG.center, CONFIG.zoom);
        
        // 3. Add Controls
        L.control.attribution({ prefix: '<a href="https://www.openstreetmap.org/about">OpenStreetMap</a> | <a href="https://leafletjs.com">Leaflet JS</a> | <a href="https://github.com/NodinCutfeet/canada-place-names-dataset">© 2025 Nodin Cutfeet CC-BY-4.0</a>' }).addTo(STATE.map);
        L.control.zoom({ position: 'bottomright' }).addTo(STATE.map);
        L.control.scale({ position: 'bottomleft', maxWidth: 200, metric: true, imperial: true }).addTo(STATE.map);

        // 4. Create Panes (Z-Index Management)
        Object.keys(CONFIG.zIndices).forEach(key => {
            STATE.map.createPane(`pane-${key}`).style.zIndex = CONFIG.zIndices[key];
        });

        // 5. Initialize Clusters
        MapUtils.initClusters();
        
        // 6. Setup Coordinate Tracking
        MapUtils.setupCoordTracking();
    },

    initClusters: () => {
        Object.keys(CONFIG.categories).forEach(cat => {
            STATE.layers[cat] = L.markerClusterGroup({
                clusterPane: `pane-${cat}`, 
                iconCreateFunction: (cluster) => MapUtils.createClusterIcon(cluster, cat),
                showCoverageOnHover: false,
                maxClusterRadius: 60,
                disableClusteringAtZoom: 7, 
                spiderfyOnMaxZoom: true
            }).addTo(STATE.map);
        });
    },

    createClusterIcon: (cluster, category) => {
        const count = cluster.getChildCount();
        const digits = String(count).length;
        // Formula: 1 digit = 30px, 2 = 34px, 3 = 38px...
        const size = 26 + (digits * 4); 
        
        return L.divIcon({
            html: `<span style="line-height: ${size}px;">${count}</span>`,
            className: `custom-cluster cluster-${category}`,
            iconSize: L.point(size, size)
        });
    },

    setupCoordTracking: () => {
        const updateCoords = () => {
            const c = STATE.map.getCenter();
            const el = { lat: $('map-lat'), lng: $('map-lng'), zoom: $('map-zoom') };
            if (el.lat) el.lat.textContent = c.lat.toFixed(4);
            if (el.lng) el.lng.textContent = c.lng.toFixed(4);
            if (el.zoom) el.zoom.textContent = STATE.map.getZoom();
        };
        STATE.map.on('move', updateCoords);
        STATE.map.on('zoom', updateCoords);
        updateCoords(); 
    },

    setBase: (k) => {
        Object.values(STATE.tiles).forEach(t => STATE.map.removeLayer(t));
        if(STATE.tiles[k]) STATE.map.addLayer(STATE.tiles[k]);
    }
};