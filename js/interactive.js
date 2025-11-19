// interactive.js

// ----------- Canvas Bubbles -----------
const canvas = document.getElementById('eventsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size dynamically
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Generate bubbles
const events = [];
const colors = ['#d13156','#c99137','#ffba08','#8ac926','#1982c4'];

for (let i = 0; i < 15; i++) {
  events.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 15 + Math.random() * 15,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function drawBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  events.forEach(event => {
    ctx.beginPath();
    ctx.arc(event.x, event.y, event.radius, 0, Math.PI*2);
    ctx.fillStyle = event.color;
    ctx.fill();
    ctx.closePath();

    // Move bubbles
    event.x += event.dx;
    event.y += event.dy;

    // Bounce off edges
    if (event.x + event.radius > canvas.width || event.x - event.radius < 0) event.dx *= -1;
    if (event.y + event.radius > canvas.height || event.y - event.radius < 0) event.dy *= -1;
  });

  requestAnimationFrame(drawBubbles);
}

// Grow on hover
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  events.forEach(event => {
    const dist = Math.hypot(mouseX - event.x, mouseY - event.y);
    if (dist < 50) {
      event.radius = Math.min(event.radius + 0.5, 40);
    } else {
      event.radius = Math.max(event.radius - 0.5, 15);
    }
  });
});

drawBubbles();

// ----------- Leaflet Map -----------
const map = L.map('eventsMap').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const eventsData = [
  { name: "Local Festival", lat: 51.505, lng: -0.09 },
  { name: "Art Workshop", lat: 51.51, lng: -0.1 },
  { name: "Music Concert", lat: 51.503, lng: -0.08 }
];

eventsData.forEach(event => {
  L.marker([event.lat, event.lng])
    .addTo(map)
    .bindPopup(`<b>${event.name}</b>`);
});

// Show user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    map.setView([userLat, userLng], 13);
    L.circle([userLat, userLng], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.2,
      radius: 500
    }).addTo(map).bindPopup("You are here");
  });
}
