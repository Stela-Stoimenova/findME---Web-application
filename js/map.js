// Map & Events
(function () {
    if (typeof L === "undefined") return;

    const DEFAULT_CENTER = [44.439663, 26.096306];
    const DEFAULT_ZOOM = 13;

    const map = L.map("map").setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    let userMarker = null;

    const eventsLayer = L.layerGroup().addTo(map);

    function addEventMarker(ev, layer = eventsLayer) {
        const marker = L.circleMarker([ev.lat, ev.lng], {
            radius: 8,
            fillColor: "#f30f6aff",
            color: "#f30f6aff",
            weight: 1.5,
            fillOpacity: 0.9
        }).addTo(layer);

        marker.bindPopup(`<strong>${ev.name}</strong><br>${ev.locationName}<br>${ev.date}`);
    }

    if (typeof EVENTS !== "undefined") {
        EVENTS.forEach(ev => addEventMarker(ev, eventsLayer));
        const bounds = L.latLngBounds(EVENTS.map(e => [e.lat, e.lng]));
        map.fitBounds(bounds.pad(0.2));
    }

    document.addEventListener("user-location", (e) => {
        const { lat, lng } = e.detail;
        if (!lat || !lng) return;

        if (userMarker) map.removeLayer(userMarker);

        userMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: "#940ff3ff",
            color: "#a515e7ff",
            weight: 1.25,
            fillOpacity: 0.95
        }).addTo(map);

        userMarker.bindPopup("<strong>Your Location</strong>").openPopup();
        map.setView([lat, lng], 14);
    });

    // Update markers when events are filtered
    document.addEventListener('events-filtered', (e) => {
        const list = (e.detail && e.detail.events) ? e.detail.events : [];
        eventsLayer.clearLayers();
        list.forEach(ev => addEventMarker(ev, eventsLayer));
        if (list.length > 0) {
            const bounds = L.latLngBounds(list.map(x => [x.lat, x.lng]));
            map.fitBounds(bounds.pad(0.2));
        }
    });

})();
