import './style.css';
import {
  AudioPlayer,
  PlaybackState,
  RepeatMode,
} from '@capawesome-team/capacitor-audio-player';

// Local tracks (see public/assets/audio/README.md for attribution).
// `metadata` per track activates the lock-screen media session.
const TRACKS = [
  {
    src: '/assets/audio/producesplatinum-vlog-hip-hop-483574.mp3',
    metadata: {
      title: 'Vlog Hip-Hop',
      artist: 'ProducesPlatinum',
      album: 'Music Player Lab',
      artworkSource: '/assets/thumbs/arttower-break-dance-7158738.jpg',
    },
  },
  {
    src: '/assets/audio/alexgrohl-energetic-action-sport-500409.mp3',
    metadata: {
      title: 'Energetic Action Sport',
      artist: 'AlexGrohl',
      album: 'Music Player Lab',
      artworkSource: '/assets/thumbs/mmckein-surf-2363367.jpg',
    },
  },
  {
    src: '/assets/audio/sigmamusicart-no-copyright-music-537751.mp3',
    metadata: {
      title: 'No Copyright Music',
      artist: 'SigmaMusicArt',
      album: 'Music Player Lab',
      artworkSource: '/assets/thumbs/shirinh-street-8306573.jpg',
    },
  },
];

// Minimal inline icons (no icon library dependency)
const ICON_PLAY =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

const artworkEl = document.getElementById('artwork');
const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const seekEl = document.getElementById('seek');
const playPauseButton = document.getElementById('play-pause');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const volumeEl = document.getElementById('volume');
const loopEl = document.getElementById('loop');
const speedButtons = document.querySelectorAll('#speed button');
const trackListEl = document.getElementById('track-list');

let hasStarted = false;
let isPlaying = false;
let currentIndex = 0;
let isSeeking = false;
let lastKnownDuration = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function sliderValueToMs(value) {
  // Native side needs an integer; a fractional value is silently dropped.
  return Math.round((Number(value) / 1000) * lastKnownDuration);
}

function renderTrackList() {
  trackListEl.innerHTML = '';
  TRACKS.forEach((track, index) => {
    const item = document.createElement('li');
    item.textContent = `${track.metadata.title} — ${track.metadata.artist}`;
    item.className = index === currentIndex ? 'active' : '';
    item.addEventListener('click', () => selectTrack(index));
    trackListEl.appendChild(item);
  });
}

function renderNowPlaying() {
  const track = TRACKS[currentIndex];
  titleEl.textContent = track.metadata.title;
  artistEl.textContent = track.metadata.artist;
  artworkEl.src = track.metadata.artworkSource;
  renderTrackList();
}

function setPlayingUi(playing) {
  isPlaying = playing;
  playPauseButton.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
}

async function startPlayback() {
  await AudioPlayer.play({ tracks: TRACKS });
  hasStarted = true;
}

async function selectTrack(index) {
  currentIndex = index;
  renderNowPlaying();
  if (hasStarted) {
    await AudioPlayer.seekTo({ index });
    await AudioPlayer.resume();
  } else {
    await startPlayback();
  }
}

playPauseButton.addEventListener('click', async () => {
  if (!hasStarted) {
    await startPlayback();
  } else if (isPlaying) {
    await AudioPlayer.pause();
  } else {
    await AudioPlayer.resume();
  }
});

previousButton.addEventListener('click', async () => {
  await AudioPlayer.skipToPreviousTrack();
});

nextButton.addEventListener('click', async () => {
  await AudioPlayer.skipToNextTrack();
});

// Capture the pointer so a long drag can't lose 'pointerup' to another element,
// and mark isSeeking so the polling interval below doesn't fight the drag.
seekEl.addEventListener('pointerdown', (event) => {
  isSeeking = true;
  seekEl.setPointerCapture(event.pointerId);
});

seekEl.addEventListener('input', () => {
  currentTimeEl.textContent = formatTime(sliderValueToMs(seekEl.value));
});

// 'pointerup', not 'change': iOS WKWebView doesn't fire 'change' reliably on touch.
seekEl.addEventListener('pointerup', async () => {
  const position = sliderValueToMs(seekEl.value);
  await AudioPlayer.seekTo({ position });
  isSeeking = false;
});

seekEl.addEventListener('pointercancel', () => {
  isSeeking = false;
});

volumeEl.addEventListener('input', async () => {
  const volume = Number(volumeEl.value);
  await AudioPlayer.setVolume({ volume });
});

speedButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const rate = Number(button.dataset.rate);
    await AudioPlayer.setRate({ rate });
    speedButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
  });
});

loopEl.addEventListener('change', async () => {
  const mode = loopEl.checked ? RepeatMode.All : RepeatMode.None;
  await AudioPlayer.setRepeatMode({ mode });
});

await AudioPlayer.addListener('trackChange', (event) => {
  currentIndex = event.index;
  renderNowPlaying();
});

await AudioPlayer.addListener('playbackStateChanged', (event) => {
  setPlayingUi(event.state === PlaybackState.Playing);
});

// No "time update" event, so poll position while playing to update the seek bar.
setInterval(async () => {
  if (!hasStarted || !isPlaying || isSeeking) return;
  const { position } = await AudioPlayer.getCurrentPosition();
  const { duration } = await AudioPlayer.getDuration();
  lastKnownDuration = duration;
  currentTimeEl.textContent = formatTime(position);
  durationEl.textContent = formatTime(duration);
  seekEl.value = duration ? Math.floor((position / duration) * 1000) : 0;
}, 500);

renderNowPlaying();
