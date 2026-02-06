/* eslint-env browser */
/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
*/

/* =========================
   GLOBAL VARS
========================= */
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = 500;
var HEIGHT = 50;
var rafID = null;
var debuglog = false;
var audioInitialized = false;

function showMicWarning() {
    const warning = document.getElementById('mic-warning');
    if (!warning) return;

    warning.classList.remove('hidden');

    // reset animation nếu gọi lại
    warning.style.animation = 'none';
    warning.offsetHeight; // force reflow
    warning.style.animation = '';

    // tự ẩn sau 4s
    setTimeout(() => {
        warning.classList.add('hidden');
    }, 4000);
}


/* =========================
   INIT
========================= */
window.onload = function () {

    // Monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const startBtn = document.querySelector('#start');

    startBtn.addEventListener('click', async function () {

        const flame = document.querySelector('.flame');

        /* =========================
           RELIGHT MODE
        ========================= */
        if (flame && flame.classList.contains('off')) {
            relightCandle();
            startBtn.textContent = 'Úm ba la thổi nến tiếp nè ✨';
            return;
        }

        /* =========================
           INIT AUDIO (ONLY ONCE)
        ========================= */
        if (audioInitialized) return;
        audioInitialized = true;

        try {
            audioContext = new AudioContext();

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            if (debuglog) {
                console.log('AudioContext state:', audioContext.state);
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            showMicWarning();

            audioStream(stream);

            document.getElementById('cake-holder').style.opacity = 1;
            enableClickToBlow();

        } catch (err) {
            console.error('Audio init failed:', err);

            alert('Không truy cập được microphone. Bạn có thể click vào nến để tắt.');

            document.getElementById('cake-holder').style.opacity = 1;
            enableClickToBlow();
        }
    });

    /* Debug buttons */
    document.querySelector('#startconsoledebug').addEventListener('click', () => {
        debuglog = true;
    });

    document.querySelector('#stopconsoledebug').addEventListener('click', () => {
        debuglog = false;
    });
};

/* =========================
   LOGIN INPUT FORMAT
========================= */
const input = document.getElementById('login-password');

input.addEventListener('keydown', (e) => {
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

/* =========================
   LOGIN CHECK
========================= */
const CORRECT_PASSWORD = '12022003';

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

/* =========================
   FALLBACK
========================= */
function didntGetStream() {
    console.warn('Stream generation failed — fallback mode');
    document.getElementById('cake-holder').style.opacity = 1;
    enableClickToBlow();
}

/* =========================
   CLICK / TOUCH TO BLOW
========================= */
function enableClickToBlow() {
    const cake = document.querySelector('.cake');
    if (!cake) return;

    const handleBlow = (source) => {
        turnOffCandle(source);
    };

    // Click chuột
    cake.addEventListener('click', (e) => {
        // Chỉ xử lý khi click trong vùng bánh
        handleBlow('click-cake');
    });

    // Touch (mobile)
    cake.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleBlow('touch-cake');
    }, { passive: false });
}


/* =========================
   CANDLE CONTROL
========================= */
function turnOffCandle(source = 'unknown') {
    const flame = document.querySelector('.flame');
    if (!flame) return;
    if (flame.classList.contains('off')) return;

    flame.classList.add('off');
    flame.style.opacity = 0;

    console.log('🔥 Candle extinguished by:', source);

    if (window.switchToCelebrateEffect) {
        window.switchToCelebrateEffect();
    }
}

function relightCandle() {
    const flame = document.querySelector('.flame');
    if (!flame) return;

    flame.classList.remove('off');
    flame.style.opacity = 1;

    console.log('🔥 Candle relit');

    if (window.switchToSnowEffect) {
        window.switchToSnowEffect();
    }
}

/* =========================
   VOLUME METER (OPTIONAL)
========================= */
function drawLoop() {
    if (!canvasContext || !meter) return;

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    canvasContext.fillStyle = meter.checkClipping() ? 'red' : 'green';
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    rafID = requestAnimationFrame(drawLoop);
}


