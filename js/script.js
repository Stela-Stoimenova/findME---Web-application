document.addEventListener("DOMContentLoaded", function () {
    const locateBtn = document.getElementById("locate-btn");
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    
    if (locateBtn) {
        locateBtn.addEventListener("click", () => {
            if (!navigator.geolocation) return alert("Geolocation not supported");

            navigator.geolocation.getCurrentPosition(pos => {
                const event = new CustomEvent("user-location", {
                    detail: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                });
                document.dispatchEvent(event);
            }, () => alert("Unable to retrieve location"), { enableHighAccuracy: true });
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
            const city = cityInput.value.trim();
            if (!city) return alert("Enter a city");

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
                const data = await res.json();
                if (!data.length) return alert("City not found");

                const { lat, lon } = data[0];
                document.dispatchEvent(new CustomEvent("user-location", {
                    detail: { lat: parseFloat(lat), lng: parseFloat(lon) }
                }));
            } catch (err) {
                console.error(err);
                alert("Error locating city");
            }
        });
    }
});
