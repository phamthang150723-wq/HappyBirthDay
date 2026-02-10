/* =====================================================
   BLINK CELEBRATE EFFECT (NO MOVEMENT)
   Optimized for Desktop & Mobile
===================================================== */

window.addEventListener("load", () => {

    /* ========== CANVAS ========== */
    const canvas = document.createElement("canvas");
    canvas.id = "effect-canvas";

    Object.assign(canvas.style, {
        position: "fixed",
        inset: "0",
        pointerEvents: "none",
        zIndex: "9999"
    });

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }


    resize();
    window.addEventListener("resize", resize);

    const isMobile = () => window.innerWidth < 768;

    /* ========== STATE ========== */
    let EFFECT = "snow";
    let particles = [];

    /* ========== SNOW (GIỮ NGUYÊN) ========== */
    function createSnow() {
        particles.length = 0;
        const COUNT = isMobile() ? 120 : 180;

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                s: Math.random() * 1.5 + 0.5
            });
        }
    }



    function drawSnow() {

        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();

        for (const p of particles) {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

            p.y += p.s;
            p.x += Math.sin(p.y * 0.01) * 0.4;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        }
        ctx.fill();
    }

    /* ========== CELEBRATE BLINK ========== */
    function createCelebrate() {
        particles.length = 0;
        const COUNT = isMobile() ? 50 : 90;

        for (let i = 0; i < COUNT; i++) {
            const size = isMobile()
                ? Math.random() * 14 + 14
                : Math.random() * 24 + 20;

            const life = Math.random() * 50 + 50;

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                icon: "✨",
                size,
                font: `${size}px serif`, // ✅ CACHE FONT
                age: Math.random() * life,
                life,
                delay: Math.random() * 60 // ⏱️ delay trước khi blink
            });
        }
    }

    function drawCelebrate() {

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const p of particles) {

            // delay để không blink đồng loạt
            if (p.delay > 0) {
                p.delay--;
                continue;
            }

            p.age++;


            let opacity = 1;

            if (p.age < 15) {
                opacity = p.age / 15;              // fade in
            } else if (p.age > p.life - 15) {
                opacity = (p.life - p.age) / 15;  // fade out
            }

            if (opacity > 0) {
                ctx.globalAlpha = opacity;
                ctx.font = p.font;
                ctx.fillText(p.icon, p.x, p.y);
            }

            // 🔁 reset SAU KHI KẾT THÚC – không reset giữa blink
            if (p.age >= p.life) {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
                p.life = Math.random() * 50 + 50;
                p.age = 0;
                p.delay = Math.random() * 60;
            }
        }

        ctx.globalAlpha = 1;
    }

    /* ========== INIT ========== */
    createSnow();

    /* ========== LOOP (THROTTLED) ========== */
    let lastTime = 0;

    function animate(time) {
        if (time - lastTime < 16) {
            requestAnimationFrame(animate);
            return;
        }
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        EFFECT === "snow" ? drawSnow() : drawCelebrate();

        requestAnimationFrame(animate);
    }

    animate(0);

    /* ========== API ========== */
    window.switchToCelebrateEffect = function () {
        EFFECT = "celebrate";
        createCelebrate();
    };

    window.switchToSnowEffect = function () {
        EFFECT = "snow";
        createSnow();
    };

    
});
