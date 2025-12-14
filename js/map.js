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

    function addEventMarker(ev) {
        const marker = L.circleMarker([ev.lat, ev.lng], {
            radius: 8,
            fillColor: "#f30f6aff",
            color: "#f30f6aff",
            weight: 1.5,
            fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(`<strong>${ev.name}</strong><br>${ev.locationName}<br>${ev.date}`);
    }

    if (typeof EVENTS !== "undefined") {
        EVENTS.forEach(addEventMarker);

        const bounds = L.latLngBounds(EVENTS.map(e => [e.lat, e.lng]));
        map.fitBounds(bounds.pad(0.2));
    }

    document.addEventListener("user-location", (e) => {
        const { lat, lng } = e.detail;
        if (!lat || !lng) return;

        if (userMarker) map.removeLayer(userMarker);

        userMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: "#0fe0f3ff",
            color: "#e71593ff",
            weight: 1.25,
            fillOpacity: 0.95
        }).addTo(map);

        userMarker.bindPopup("<strong>Your Location</strong>").openPopup();
        map.setView([lat, lng], 14);
    });

})();
