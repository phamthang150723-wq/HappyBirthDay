window.addEventListener("load", () => {

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
    function isMobile() {
        return window.innerWidth < 768;
    }

    resize();
    window.addEventListener("resize", resize);

    /* ================== EFFECT STATE ================== */
    let EFFECT = "snow"; // snow | celebrate
    let COUNT = 180;
    let particles = [];

    function createSnow() {
        particles = [];
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                s: Math.random() * 1.5 + 0.5
            });
        }
    }

    function createCelebrate() {
        particles = [];
        const icons = ["✨"];

        const COUNT = isMobile() ? 60 : 120;

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,

                icon: icons[Math.floor(Math.random() * icons.length)],

                size: isMobile()
                    ? Math.random() * 14 + 14
                    : Math.random() * 26 + 20,

                life: Math.random() * 60 + 60,   // tổng frame tồn tại
                age: 0                           // tuổi hiện tại
            });
        }
    }


    createSnow();

    function drawSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();

        for (const p of particles) {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            p.y += p.s;
            p.x += Math.sin(p.y * 0.01) * 0.5;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        }
        ctx.fill();
    }

    function drawCelebrate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const p of particles) {
            p.age++;

            // ===== opacity theo vòng đời =====
            let opacity = 1;

            if (p.age < 20) {
                // fade in
                opacity = p.age / 20;
            } else if (p.age > p.life - 20) {
                // fade out
                opacity = (p.life - p.age) / 20;
            }

            ctx.globalAlpha = Math.max(0, opacity);

            ctx.font = `${p.size}px serif`;
            ctx.fillText(p.icon, p.x, p.y);

            // ===== reset khi hết vòng đời =====
            if (p.age >= p.life) {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
                p.age = 0;
                p.life = Math.random() * 60 + 60;
            }
        }

        ctx.globalAlpha = 1;
    }


    function animate() {
        if (EFFECT === "snow") drawSnow();
        else drawCelebrate();

        requestAnimationFrame(animate);
    }

    animate();

    /* ================== PUBLIC API ================== */
    window.switchToCelebrateEffect = function () {
        EFFECT = "celebrate";
        createCelebrate();
    };
    window.switchToSnowEffect = function () {
        EFFECT = "snow";
        createSnow();
    };


});
