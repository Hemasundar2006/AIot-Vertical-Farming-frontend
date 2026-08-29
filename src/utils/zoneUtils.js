export const getZoneKey = (zone) => {
    const zoneIdStr = zone.id != null ? String(zone.id) : '';
    const zoneNameStr = zone.name ? String(zone.name) : '';
    const zoneId = (zoneIdStr || zoneNameStr).toLowerCase();
    
    if (typeof zone.id === 'number' && zone.id >= 1 && zone.id <= 3) {
        return `zone${zone.id}`;
    }
    if (zoneId.includes('1') || zoneId.includes('zone1') || zoneId.includes('one')) return 'zone1';
    if (zoneId.includes('2') || zoneId.includes('zone2') || zoneId.includes('two')) return 'zone2';
    if (zoneId.includes('3') || zoneId.includes('zone3') || zoneId.includes('three')) return 'zone3';
    
    const match = zoneId.match(/\d+/);
    if (match) {
        const num = parseInt(match[0], 10);
        if (num >= 1 && num <= 3) return `zone${num}`;
    }
    return 'zone1';
};

export const filterLayersForUser = (layers, user) => {
    const layersList = Array.isArray(layers) ? layers : Object.values(layers);
    
    // Admin sees all zones
    if (!user || user.role === 'admin') {
        return layersList;
    }
    
    // Farmer/user only sees their assigned zoneId if they have one
    if ((user.role === 'farmer' || user.role === 'user') && user.zoneId) {
        const uZoneStr = String(user.zoneId).toLowerCase();
        return layersList.filter(layer => {
            const layerIdStr = String(layer.id).toLowerCase();
            const layerKey = getZoneKey(layer);
            return layerIdStr === uZoneStr || layerKey === uZoneStr || layerKey === `zone${uZoneStr}`;
        });
    }
    
    return layersList;
};
