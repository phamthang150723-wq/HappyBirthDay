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
}

// Optional volume meter draw loop
function drawLoop(time) {
    if (!canvasContext || !meter) return;

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    canvasContext.fillStyle = meter.checkClipping() ? 'red' : 'green';
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    rafID = window.requestAnimationFrame(drawLoop);
}


