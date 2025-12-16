(function(){
  const grid = document.getElementById('event-grid');
  const FAVORITES_KEY = 'favorites';
  function getFavorites(){
    try { const raw = localStorage.getItem(FAVORITES_KEY); return raw ? JSON.parse(raw) : []; } catch(_) { return []; }
  }

  function renderSaved(){
    if(!grid) return;
    grid.innerHTML = '';
    const ids = new Set(getFavorites());
    const list = (typeof EVENTS !== 'undefined') ? EVENTS.filter(ev => ids.has(ev.id)) : [];

    if (list.length === 0){
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '2rem';
      empty.style.color = '#2c3e50';
      empty.textContent = 'No saved events yet. Tap the heart on any event to save it.';
      grid.appendChild(empty);
      return;
    }

    list.forEach(ev => grid.appendChild(createEventCard(ev)));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSaved);
  } else {
    renderSaved();
  }

  document.addEventListener('favorites-updated', renderSaved);
})();
