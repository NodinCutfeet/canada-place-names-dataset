/**
 * config.js
 * Central configuration and global state management.
 */

const PROVINCES = {
    "BC": "British Columbia", "AB": "Alberta", "SK": "Saskatchewan", "MB": "Manitoba",
    "ON": "Ontario", "QC": "Quebec", "NB": "New Brunswick", "NS": "Nova Scotia",
    "PE": "Prince Edward Island", "NL": "Newfoundland and Labrador",
    "YT": "Yukon", "NT": "Northwest Territories", "NU": "Nunavut"
};

const CONFIG = {
    // Map View Settings
    center: [64, -100],
    zoom: 4,
    minZoom: 4,
    maxZoom: 17,
    maxBounds: [[30, -150], [90, -40]],

    // Category Settings
    // Key 'indig' MUST match the CSS classes (.bg-indig, .cluster-indig)
    categories: {
        indig: { color: '#007aff', radius: 7.0, label: 'Indigenous' },   
        micro: { color: '#ff3b30', radius: 6.0, label: 'MicroList' },   
        short: { color: '#ff9500', radius: 5.0, label: 'ShortList' },   
        full:  { color: '#af52de', radius: 4.0, label: 'FullList' }     
    },

    // Map Pane Z-Indices
    zIndices: {
        indig: 630,
        full: 620,
        short: 610,
        micro: 600
    }
};

const STATE = {
    map: null,
    data: [],
    lookup: new Map(),
    layers: {},       
    tiles: {},         
    stats: { indig: 0, micro: 0, short: 0, full: 0 }
};