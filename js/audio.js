// Purpose: persistent background audio. Callers: main/navigation. Deps: DOM, localStorage. API: initAudioPlayer. Side effects: injects audio/player, saves playback state.
const audioStateKey = 'kn_audio_state';
const audioFile = 'musik.mp3.aac';

function getAudioState() {
  try { return JSON.parse(localStorage.getItem(audioStateKey) || '{"enabled":true}'); }
  catch { return { enabled: true }; }
}

function saveAudioState(audio, enabled) {
  localStorage.setItem(audioStateKey, JSON.stringify({
    enabled,
    time: audio.currentTime || 0,
    volume: audio.volume,
  }));
}

function initAudioPlayer() {
  if (document.getElementById('bgAudio')) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <audio id="bgAudio" loop preload="auto"><source src="${audioFile}" type="audio/aac"></audio>
    <div class="audio-player" id="audioPlayer">
      <button class="ap-toggle" id="apToggle" title="Play / Pause">▶</button>
      <div class="ap-info">
        <span class="ap-title">☕ Kopi Nusantara</span>
        <span class="ap-sub" id="apStatus">Memuat musik...</span>
      </div>
      <div class="ap-eq" id="apEq"><span></span><span></span><span></span><span></span><span></span></div>
      <input type="range" class="ap-vol" id="apVol" min="0" max="1" step="0.05" value="0.5" title="Volume"/>
    </div>
  `);

  const audio = document.getElementById('bgAudio');
  const toggle = document.getElementById('apToggle');
  const status = document.getElementById('apStatus');
  const eq = document.getElementById('apEq');
  const vol = document.getElementById('apVol');
  const state = getAudioState();

  audio.volume = Number.isFinite(state.volume) ? state.volume : parseFloat(vol.value);
  vol.value = audio.volume;

  function setPlaying(isPlaying) {
    toggle.textContent = isPlaying ? '⏸' : '▶';
    status.textContent = isPlaying ? 'Sedang diputar...' : 'Dijeda';
    eq.classList.toggle('playing', isPlaying);
  }

  function playAudio() {
    return audio.play().then(() => {
      setPlaying(true);
      saveAudioState(audio, true);
    });
  }

  audio.addEventListener('loadedmetadata', () => {
    if (state.time && state.time < audio.duration) audio.currentTime = state.time;
    if (state.enabled !== false) playAudio().catch(() => { status.textContent = 'Klik ▶ untuk mulai'; });
  });
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    if (audio.paused) playAudio().catch(() => { status.textContent = 'Klik ▶ untuk memutar'; });
    else {
      audio.pause();
      setPlaying(false);
      saveAudioState(audio, false);
    }
  });
  vol.addEventListener('input', () => {
    audio.volume = parseFloat(vol.value);
    saveAudioState(audio, !audio.paused);
  });
  audio.addEventListener('timeupdate', () => saveAudioState(audio, !audio.paused));
  window.addEventListener('beforeunload', () => saveAudioState(audio, !audio.paused));
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
}
