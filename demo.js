/* eslint-env browser */
/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson


*/

var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = 500;
var HEIGHT = 50;
var rafID = null;

var debuglog = false;

window.onload = function () {

    // Monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // START button — REQUIRED for desktop Chrome
    document.querySelector('#start').addEventListener('click', async function () {

        try {
            // Create AudioContext INSIDE user interaction
            audioContext = new AudioContext();

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            if (debuglog) {
                console.log('AudioContext state:', audioContext.state);
            }

            // Request microphone AFTER user click
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            // ⬅️ DÙNG audioStream GỐC (audioStream.js)
            audioStream(stream);

            // Show cake
            document.getElementById('cake-holder').style.opacity = 1;

            // ⬅️ CHỈ THÊM DÒNG NÀY
            enableClickToBlow();

        } catch (err) {
            console.error('Audio init failed:', err);

            alert('Không truy cập được microphone. Bạn có thể click vào nến để tắt.');

            document.getElementById('cake-holder').style.opacity = 1;
            enableClickToBlow();
        }
    });

    // Debug controls
    document.querySelector('#startconsoledebug').addEventListener('click', function () {
        debuglog = true;
    });

    document.querySelector('#stopconsoledebug').addEventListener('click', function () {
        debuglog = false;
    });
};

const input = document.getElementById('login-password');

input.addEventListener('keydown', (e) => {
  // Nếu đang xoá ngay sau dấu /
  if (e.key === 'Backspace') {
    const pos = input.selectionStart;
    if (pos === 3 || pos === 6) {
      e.preventDefault();
      input.value =
        input.value.slice(0, pos - 1) + input.value.slice(pos);
      input.setSelectionRange(pos - 1, pos - 1);
    }
  }
});

input.addEventListener('input', () => {
  let value = input.value.replace(/\D/g, '').slice(0, 8);

  let result = '';
  if (value.length >= 2) {
    result = value.slice(0, 2);
    if (value.length >= 3) result += '/' + value.slice(2, 4);
    if (value.length >= 5) result += '/' + value.slice(4);
  } else {
    result = value;
  }

  input.value = result;
});


const CORRECT_PASSWORD = '12022003'; // ddmmyyyy

function checkPassword() {
  const input = document.getElementById('login-password');
  const error = document.getElementById('login-error');
  const overlay = document.getElementById('login-overlay');
  const cake = document.getElementById('cake-content');

  const clean = input.value.replace(/\D/g, '');

  if (clean === CORRECT_PASSWORD) {
    error.style.display = 'none';
    overlay.classList.add('hide');
    cake.style.opacity = 1;
    cake.style.pointerEvents = 'auto';
  } else {
    error.style.display = 'block';
    overlay.classList.add('shake');
    setTimeout(() => overlay.classList.remove('shake'), 400);
  }
}


// Fallback
function didntGetStream() {
    console.warn('Stream generation failed — fallback mode');
    document.getElementById('cake-holder').style.opacity = 1;
    enableClickToBlow();
}

/* =========================
   CLICK / TOUCH TO BLOW
========================= */
function enableClickToBlow() {
    const candle = document.querySelector('.candle');
    if (!candle) return;

    candle.addEventListener('click', extinguishCandle);

    candle.addEventListener('touchstart', function (e) {
        e.preventDefault();
        extinguishCandle();
    }, { passive: false });
}

function extinguishCandle() {
    const flame = document.querySelector('.flame');
    if (!flame) return;

    if (flame.classList.contains('off')) return;

    flame.classList.add('off');
    flame.style.opacity = 0;

    console.log('🔥 Candle extinguished by click/touch');
    // 🎉 ĐỔI HIỆU ỨNG KHI NẾN TẮT
    if (window.switchToCelebrateEffect) {
        window.switchToCelebrateEffect();
    }
}

// Optional volume meter draw loop
function drawLoop(time) {
    if (!canvasContext || !meter) return;

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    canvasContext.fillStyle = meter.checkClipping() ? 'red' : 'green';
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    rafID = window.requestAnimationFrame(drawLoop);
}


