let currentlyPlayingAudio = null;
const EVENTS = [
    {
        id: 1,
        name: "Jazz Festival",
        locationName: "Central Park",
        date: "Oct 2025",
        lat: 44.439663,
        lng: 26.096306,
        image: "../assets/jazzfestival.jpg",
        audio: "../assets/sax-jazz-77053.mp3"
    },
    {
        id: 2,
        name: "Tech Workshop",
        locationName: "University Hall",
        date: "Nov 2025",
        lat: 44.437825,
        lng: 26.097075,
        image: "../assets/techworkshop.jpg",
        audio: "../assets/free-tech-house-bass-253451.mp3"
    },
    {
        id: 3,
        name: "Street Food Fair",
        locationName: "Old Town",
        date: "Oct 18, 2025",
        lat: 44.439000,
        lng: 26.099500,
        image: "../assets/streetfood.jpg",
        audio: "../assets/food-truck-1887-379072.mp3"
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
    eventGrid.appendChild(card);
});
