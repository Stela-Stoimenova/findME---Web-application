let currentlyPlayingAudio = null;
let currentCategory = 'all';
let currentSearch = '';
const FAVORITES_KEY = 'favorites';

function getFavorites() {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function saveFavorites(list) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch (_) {}
}

function isFavorite(id) {
    return getFavorites().includes(id);
}

function toggleFavorite(id) {
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(x => x !== id);
    } else {
        favs.push(id);
    }
    saveFavorites(favs);
    document.dispatchEvent(new CustomEvent('favorites-updated', { detail: { favorites: favs } }));
    return favs.includes(id);
}

const EVENTS = [
    // Entertainment
    {
        id: 1,
        name: "Jazz Festival",
        locationName: "Central Park",
        date: "Oct 2025",
        category: "entertainment",
        lat: 44.439663,
        lng: 26.096306,
        image: "../assets/jazzfestival.jpg",
        audio: "../assets/meeting.mp3"
    },
    {
        id: 4,
        name: "Open Air Cinema",
        locationName: "Riverside Park",
        date: "Oct 2025",
        category: "entertainment",
        lat: 44.4415,
        lng: 26.1031,
        image: "../assets/cinema.jpg",
        audio: "../assets/cinema.mp3"
    },
    // Educational
    {
        id: 2,
        name: "Tech Workshop",
        locationName: "University Hall",
        date: "Nov 2025",
        category: "educational",
        lat: 44.437825,
        lng: 26.097075,
        image: "../assets/techworkshop.jpg",
        audio: "../assets/meeting.mp3"
    },
    {
        id: 5,
        name: "Startup Meetup",
        locationName: "Innovation Hub",
        date: "Nov 2025",
        category: "educational",
        lat: 44.4342,
        lng: 26.1012,
        image: "../assets/meeting.jpg",
        audio: "../assets/meeting.mp3"
    },
    // Sport
    {
        id: 6,
        name: "5K City Run",
        locationName: "City Stadium",
        date: "Oct 22, 2025",
        category: "sport",
        lat: 44.4431,
        lng: 26.0952,
        image: "../assets/marathon.jpg",
        audio: "../assets/marathon.mp3"
    },
    {
        id: 7,
        name: "Weekend Cycling Tour",
        locationName: "Northern Trail",
        date: "Oct 26, 2025",
        category: "sport",
        lat: 44.4475,
        lng: 26.0899,
        image: "../assets/marathon.jpg",
        audio: "../assets/cycling.mp3"
    },
    // Wellness
    {
        id: 8,
        name: "Sunrise Yoga",
        locationName: "Botanical Garden",
        date: "Oct 21, 2025",
        category: "wellness",
        lat: 44.4370,
        lng: 26.1100,
        image: "../assets/yoga.jpg",
        audio: "../assets/yoga.mp3"
    },
    {
        id: 9,
        name: "Meditation Workshop",
        locationName: "Community Center",
        date: "Nov 02, 2025",
        category: "wellness",
        lat: 44.4312,
        lng: 26.1155,
        image: "../assets/meditation.jpg",
        audio: "../assets/meditation.mp3"
    },
    // Spiritual
    {
        id: 10,
        name: "Mindfulness Retreat",
        locationName: "Lake House",
        date: "Nov 10, 2025",
        category: "spiritual",
        lat: 44.4501,
        lng: 26.1208,
        image: "../assets/retreat.jpg",
        audio: "../assets/retreat.mp3"
    },
    {
        id: 11,
        name: "Evening Chanting Circle",
        locationName: "Riverside Temple",
        date: "Oct 28, 2025",
        category: "spiritual",
        lat: 44.4299,
        lng: 26.0905,
        image: "../assets/chanting.jpg",
        audio: "../assets/chanting.mp3"
    }
];

function createEventCard(ev) {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.setAttribute("data-category", ev.category);

    card.innerHTML = `
        <button class="favorite-btn"><img src="../assets/heartIcon.png" alt="Favorite"></button>
        <img src="${ev.image}" alt="${ev.name}">
        <h3>${ev.name}</h3>
        <p>${ev.locationName}</p>
        <p>${ev.date}</p>
        <div class="audio-container">
            <button class="play-btn"><img src="../assets/playIcon.png" alt="Play"></button>
            <div class="audio-progress">
                 <div class="audio-fill"></div>
            </div>
            <audio src="${ev.audio}"></audio>
        </div>
    `;
    const playBtn = card.querySelector(".play-btn");
    const playIcon = playBtn.querySelector("img");
    const audio = card.querySelector("audio");
    const fill = card.querySelector(".audio-fill");
    const progress = card.querySelector(".audio-progress");
    const favBtn = card.querySelector('.favorite-btn');

    // Initialize favorite state
    if (isFavorite(ev.id)) {
        favBtn.classList.add('saved');
        favBtn.setAttribute('aria-pressed', 'true');
        favBtn.title = 'Saved';
    } else {
        favBtn.setAttribute('aria-pressed', 'false');
        favBtn.title = 'Save';
    }

    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowSaved = toggleFavorite(ev.id);
        favBtn.classList.toggle('saved', nowSaved);
        favBtn.setAttribute('aria-pressed', nowSaved ? 'true' : 'false');
        favBtn.title = nowSaved ? 'Saved' : 'Save';
    });

    //making the sounds not overlap, pause if the button is pressed again and change icon for play and pause
    playBtn.addEventListener("click", () => {
        if(audio.paused){
        if(currentlyPlayingAudio && currentlyPlayingAudio !== audio){
            currentlyPlayingAudio.pause();
            currentlyPlayingAudio.currentTime = 0;
            currentlyPlayingAudio.closest('.event-card')
          .querySelector('.play-btn img').src = "../assets/playIcon.png";
        }
        audio.play();
        currentlyPlayingAudio = audio;
    }else{
        audio.pause();
    }
    });
    audio.addEventListener("play", () => {
        playIcon.src = "../assets/pauseIcon.png";
  });
    audio.addEventListener("pause",() =>{
        playIcon.src = "../assets/playIcon.png";
    });

    //Sound bar update
    audio.addEventListener("timeupdate", () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        fill.style.width = percent + "%";
    });

    //Click on bar to seek
    progress.addEventListener("click", (e) => {
        const rect = progress.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    return card;
}

// Populate event grid
const eventGrid = document.getElementById("event-grid");

function renderEvents(category = currentCategory, search = currentSearch) {
    currentCategory = category;
    currentSearch = search;
    eventGrid.innerHTML = '';

    let list = (category === 'all') ? EVENTS : EVENTS.filter(ev => ev.category === category);
    if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(ev => ev.name.toLowerCase().includes(q) || ev.locationName.toLowerCase().includes(q));
    }

    list.forEach(ev => {
        eventGrid.appendChild(createEventCard(ev));
    });

    // Notify map to update markers to current list
    document.dispatchEvent(new CustomEvent('events-filtered', { detail: { events: list } }));

    // When no events match, show a gentle message
    if (list.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = 'No events match this filter yet. Try another category or search.';
        empty.style.textAlign = 'center';
        empty.style.padding = '1rem';
        empty.style.color = '#2c3e50';
        eventGrid.appendChild(empty);
    }
}

// Initial render
renderEvents();

// Filter buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            renderEvents(category, currentSearch);
        });
    });
    
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const targetBtn = document.querySelector(`[data-category="${categoryParam}"]`);
        if (targetBtn) {
            filterButtons.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            renderEvents(categoryParam, currentSearch);
        }
    }

    // React to navbar filter selection via custom event
    document.addEventListener('apply-category-filter', (e) => {
        const cat = (e.detail && e.detail.category) ? e.detail.category : 'all';
        const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
        const allBtns = document.querySelectorAll('.filter-btn');
        allBtns.forEach(b => b.classList.remove('active'));
        if (targetBtn) targetBtn.classList.add('active');
        renderEvents(cat, currentSearch);
    });

    // Apply text search coming from global search
    document.addEventListener('apply-search', (e) => {
        const q = (e.detail && e.detail.q) ? e.detail.q : '';
        renderEvents(currentCategory, q);
    });

    // Init from URL params
    const urlParams2 = new URLSearchParams(window.location.search);
    const qParam = urlParams2.get('q');
    if (qParam) {
        renderEvents(currentCategory, qParam);
    }
});
