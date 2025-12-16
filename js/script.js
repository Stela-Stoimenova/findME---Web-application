document.addEventListener("DOMContentLoaded", function () {
    const locateBtn = document.getElementById("locate-btn");
    const globalInput = document.getElementById("global-search-input");
    const sounds = {
        sound1 : new Audio("../assets/sax-jazz-77053.mp3"),
        sound2 : new Audio("../assets/free-tech-house-bass-253451.mp3"),
        sound3 : new Audio("../assets/food-truck-1887-379072.mp3")
    }
    
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

    async function geocodeAndCenter(query){
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (!data.length) {
                document.dispatchEvent(new CustomEvent('apply-search', { detail: { q: query } }));
                return;
            }

            const { lat, lon } = data[0];
            document.dispatchEvent(new CustomEvent("user-location", {
                detail: { lat: parseFloat(lat), lng: parseFloat(lon) }
            }));
            const mapEl = document.getElementById('map');
            if (mapEl && typeof mapEl.scrollIntoView === 'function') {
                mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } catch (err) {
            console.error(err);
            alert("Error locating city");
        }
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        if (globalInput) globalInput.value = q;
        geocodeAndCenter(q);
        document.dispatchEvent(new CustomEvent('apply-search', { detail: { q } }));
    }
    Object.values(sounds).forEach(audio =>{
        audio.volume = 0.5;
    })
});
