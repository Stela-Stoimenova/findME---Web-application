(function(){
  const placeholder = document.querySelector('#video-section .video-placeholder');
  if (!placeholder) return;

  const apiPath = '../assets/videos.json';

  function formatDuration(sec){
    if (!sec && sec !== 0) return '';
    const m = Math.floor(sec/60); const s = sec % 60;
    return m > 0 ? `${m}:${String(s).padStart(2,'0')}` : `0:${String(s).padStart(2,'0')}`;
  }

  function createCard(video){
    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('role','group');
    card.setAttribute('aria-label', video.title);

    const thumb = document.createElement('img');
    thumb.src = video.thumbnail || video.posterLow || '';
    thumb.alt = video.title + ' thumbnail';
    thumb.loading = 'lazy';
    thumb.className = 'video-thumb';

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'thumb-wrap';
    thumbWrap.appendChild(thumb);

    const fav = document.createElement('button');
    fav.className = 'favorite-btn';
    fav.title = 'Save video';
    fav.innerHTML = '<img src="../assets/heartIcon.png" alt="save">';
    thumbWrap.appendChild(fav);

    const meta = document.createElement('div');
    meta.className = 'video-meta';
    const h = document.createElement('h3'); h.textContent = video.title;
    const p = document.createElement('p'); p.textContent = video.description;
    const info = document.createElement('div'); info.className = 'video-info';
    const dur = document.createElement('span'); dur.className = 'video-duration'; dur.textContent = formatDuration(video.duration);

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn play-overlay';
      playBtn.setAttribute('aria-label', `Play ${video.title}`);
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"></path></svg>`;

    info.appendChild(dur);
    meta.appendChild(h); meta.appendChild(p); meta.appendChild(info);

    card.appendChild(thumbWrap);
    card.appendChild(meta);
    card.appendChild(playBtn);

    playBtn.addEventListener('click', ()=> initPlayer(card, video));
    thumb.addEventListener('click', ()=> initPlayer(card, video));
    h.addEventListener('click', ()=> initPlayer(card, video));

    // favorite toggle (client-only)
    fav.addEventListener('click', (e)=>{
      e.stopPropagation();
      fav.classList.toggle('saved');
    });
    return card;
  }

  function initPlayer(container, video){
    // Replace container contents with player
    const playerWrap = document.createElement('div');
    playerWrap.className = 'video-player-wrap';
    playerWrap.setAttribute('role','region');
    playerWrap.setAttribute('aria-label', video.title + ' video player');

    if (video.sourceType === 'youtube' && video.youtubeId){
      // responsive iframe wrapper
      const wrap = document.createElement('div'); wrap.className = 'responsive-embed';
      const iframe = document.createElement('iframe');
      iframe.setAttribute('loading','lazy');
      iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen','');
      iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1`;
      iframe.title = video.title;
      wrap.appendChild(iframe);
      playerWrap.appendChild(wrap);
    } else if (video.hlsUrl){
      // HLS - use video tag (HLS playback depends on platform/browser)
      const vid = document.createElement('video');
      vid.controls = true; vid.playsInline = true; vid.width = 640;
      const source = document.createElement('source'); source.src = video.hlsUrl; source.type = 'application/x-mpegURL';
      vid.appendChild(source);
      if (video.captions && video.captions.length){
        video.captions.forEach(t => {
          const track = document.createElement('track');
          track.kind = 'subtitles'; track.label = t.label; track.srclang = t.lang; track.src = t.url;
          vid.appendChild(track);
        });
      }
      playerWrap.appendChild(vid);
    } else if (video.mp4Url){
      const vid = document.createElement('video');
      vid.controls = true; vid.playsInline = true; vid.style.width = '100%'; vid.preload = 'metadata';
      const source = document.createElement('source'); source.src = video.mp4Url; source.type = 'video/mp4';
      vid.appendChild(source);
      if (video.captions && video.captions.length){
        video.captions.forEach(t => {
          const track = document.createElement('track');
          track.kind = 'subtitles'; track.label = t.label; track.srclang = t.lang; track.src = t.url; track.default = false;
          vid.appendChild(track);
        });
      }
      playerWrap.appendChild(vid);

      // simple analytics stub
      vid.addEventListener('play', ()=> {
        recordPlay(video.id);
      }, {once:true});
    } else {
      const msg = document.createElement('div'); msg.textContent = 'No playable source available.'; playerWrap.appendChild(msg);
    }

    // preserve existing children so we can restore them
    const previousChildren = Array.from(container.children);
    container.appendChild(playerWrap);
    previousChildren.forEach(ch => { if (ch !== playerWrap) ch.style.display = 'none'; });

    // add a close button so user can return to the card
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-player';
    closeBtn.setAttribute('aria-label','Close video');
    closeBtn.innerHTML = '✕';
    playerWrap.appendChild(closeBtn);
    closeBtn.addEventListener('click', ()=>{
      const vid = playerWrap.querySelector('video'); if (vid && !vid.paused) try{ vid.pause(); }catch(e){}
      playerWrap.remove();
      previousChildren.forEach(ch => ch.style.display = '');
    });

    // focus the first focusable inside player for accessibility
    const focusTarget = playerWrap.querySelector('iframe, video, button');
    if (focusTarget) focusTarget.focus();
  }

  function recordPlay(id){
    // best-effort analytics; no backend -> console log
    fetch(`/api/videos/${encodeURIComponent(id)}/play`, {method:'POST'}).catch(()=>{});
    console.log('video play recorded', id);
  }

  // load list
  fetch(apiPath).then(r=>r.json()).then(json=>{
    const list = json && json.data ? json.data : [];
    if (!list.length){
      placeholder.textContent = 'No videos available yet.'; return;
    }
    const grid = document.createElement('div'); grid.className = 'video-grid';
    list.forEach(v=>{
      const card = createCard(v);
      grid.appendChild(card);
    });
    placeholder.appendChild(grid);
  }).catch(err=>{
    console.error('Video API load error', err);
    placeholder.textContent = 'Unable to load videos.';
  });

})();
