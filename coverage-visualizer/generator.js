/**
 * generator.js
 * Handles data export and JSON file generation.
 */
const GeneratorUtils = {
    export: (type, masterData) => {
        let data, filename;
        const clean = (p) => ({
            name: p.name, 
            province: p.province, 
            latitude: p.latitude, 
            longitude: p.longitude, 
            indigenous: p.Indigenous // Export updated key
        });

        const groupByName = (list) => {
            const map = {};
            list.forEach(p => {
                if (!map[p.province]) map[p.province] = [];
                map[p.province].push(p.name);
            });
            return Object.keys(map).sort().reduce((acc, prov) => {
                acc[prov] = map[prov].sort((a, b) => a.localeCompare(b));
                return acc;
            }, {});
        };

        switch (type) {
            case 'places-full':
                data = masterData.map(clean);
                filename = 'places-full.json';
                break;
            case 'places-short':
                data = masterData.filter(p => p.shortListed).map(clean);
                filename = 'places-shortlist.json';
                break;
            case 'places-micro':
                data = masterData.filter(p => p.microListed).map(clean);
                filename = 'places-microlist.json';
                break;
            case 'names-full':
                data = groupByName(masterData);
                filename = 'names-full.json';
                break;
            case 'names-short':
                data = groupByName(masterData.filter(p => p.shortListed));
                filename = 'names-shortlist.json';
                break;
            case 'names-micro':
                data = groupByName(masterData.filter(p => p.microListed));
                filename = 'names-microlist.json';
                break;
        }
        if (data) GeneratorUtils.download(data, filename);
    },

    download: (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};