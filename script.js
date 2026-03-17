const timeDisplay = document.getElementById('timeDisplay');
const statusText = document.getElementById('statusText');
const lapCountText = document.getElementById('lapCount');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapStopBtn = document.getElementById('lapStopBtn');
const resetBtn = document.getElementById('resetBtn');

let startTime = 0;
let elapsedMs = 0;
let timerId = null;
let laps = 0;
let resetHoldTimeout = null;
let resetHeld = false;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const tenths = Math.floor((ms % 1000) / 100);
  return `${hours}:${minutes}:${seconds}.${tenths}`;
}

function render() {
  timeDisplay.textContent = formatTime(elapsedMs);
  lapCountText.textContent = `Laps: ${laps}`;
}

function tick() {
  elapsedMs = Date.now() - startTime;
  render();
}

function isRunning() {
  return timerId !== null;
}

function startTimer() {
  if (isRunning()) return;
  startTime = Date.now() - elapsedMs;
  timerId = setInterval(tick, 100);
  statusText.textContent = 'Running...';
}

function pauseTimer(message = 'Paused.') {
  if (!isRunning()) return;
  clearInterval(timerId);
  timerId = null;
  elapsedMs = Date.now() - startTime;
  render();
  statusText.textContent = message;
}

function lapAndStop() {
  if (isRunning()) {
    laps += 1;
    pauseTimer(`Stopped. Total laps: ${laps}`);
  } else {
    statusText.textContent = `Timer is not running. Total laps: ${laps}`;
  }
  render();
}

function fullReset() {
  if (isRunning()) {
    clearInterval(timerId);
    timerId = null;
  }
  elapsedMs = 0;
  startTime = 0;
  laps = 0;
  render();
  statusText.textContent = 'Timer and laps reset.';
}

function beginResetHold() {
  resetHeld = false;
  statusText.textContent = 'Keep holding reset...';
  resetHoldTimeout = setTimeout(() => {
    resetHeld = true;
    fullReset();
  }, 2000);
}

function cancelResetHold() {
  if (resetHoldTimeout) {
    clearTimeout(resetHoldTimeout);
    resetHoldTimeout = null;
  }
  if (!resetHeld) {
    statusText.textContent = 'Reset canceled (hold for 2 seconds).';
  }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => pauseTimer('Paused by user.'));
lapStopBtn.addEventListener('click', lapAndStop);

resetBtn.addEventListener('mousedown', beginResetHold);
resetBtn.addEventListener('touchstart', beginResetHold, { passive: true });

resetBtn.addEventListener('mouseup', cancelResetHold);
resetBtn.addEventListener('mouseleave', cancelResetHold);
resetBtn.addEventListener('touchend', cancelResetHold);
resetBtn.addEventListener('touchcancel', cancelResetHold);

render();
