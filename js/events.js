const EVENTS = [
    {
        id: 1,
        name: "Jazz Festival",
        locationName: "Central Park",
        date: "Oct 2025",
        lat: 44.439663,
        lng: 26.096306,
        image: "../assets/jazzfestival.jpg",
        audio: "../assets/jazz-promo.mp3"
    },
    {
        id: 2,
        name: "Tech Workshop",
        locationName: "University Hall",
        date: "Nov 2025",
        lat: 44.437825,
        lng: 26.097075,
        image: "../assets/techworkshop.jpg",
        audio: "../assets/tech-promo.mp3"
    },
    {
        id: 3,
        name: "Street Food Fair",
        locationName: "Old Town",
        date: "Oct 18, 2025",
        lat: 44.439000,
        lng: 26.099500,
        image: "../assets/streetfood.jpg",
        audio: "../assets/streetfood-promo.mp3"
    }
];

// Populate event grid
const eventGrid = document.getElementById("event-grid");

EVENTS.forEach(ev => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
        <button class="favorite-btn"><img src="../assets/heartIcon.png" alt="Favorite"></button>
        <img src="${ev.image}" alt="${ev.name}">
        <h3>${ev.name}</h3>
        <p>${ev.locationName}</p>
        <p>${ev.date}</p>
        <div class="audio-container">
            <button class="play-btn"><img src="../assets/playIcon.png" alt="Play"></button>
            <audio src="${ev.audio}"></audio>
        </div>
    `;

    const playBtn = card.querySelector(".play-btn");
    const audio = card.querySelector("audio");
    playBtn.addEventListener("click", () => audio.play());

    eventGrid.appendChild(card);
});
