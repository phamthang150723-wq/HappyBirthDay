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
    resize();
    window.addEventListener("resize", resize);

    // cấu hình chủ đề
    const THEME = "leaves"; // 👉 snow | rain | leaves | sakura

    let COUNT = 150;
    let particles = [];

    function createParticles() {
        particles = [];
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                s: Math.random() * 1.5 + 0.5,
                rot: Math.random() * Math.PI
            });
        }
    }

    if (THEME === "snow") {
        COUNT = 180;
        createParticles();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.beginPath();

            for (const p of particles) {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            }

            ctx.fill();
            update();
            requestAnimationFrame(draw);
        }

        function update() {
            for (const p of particles) {
                p.y += p.s;
                p.x += Math.sin(p.y * 0.01) * 0.5; // 🌬️ gió nhẹ

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            }
        }

        draw();
    }
    
    if (THEME === "rain") {
        COUNT = 400;
        createParticles();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(180,220,255,0.7)";
            ctx.lineWidth = 1;

            for (const p of particles) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y + 12);
                ctx.stroke();
            }

            update();
            requestAnimationFrame(draw);
        }

        function update() {
            for (const p of particles) {
                p.y += p.s * 6;
                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            }
        }

        draw();
    }
    
    if (THEME === "leaves") {
        COUNT = 60;
        createParticles();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = "rgba(180,120,40,0.9)";
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r * 2, p.r, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update();
            requestAnimationFrame(draw);
        }

        function update() {
            for (const p of particles) {
                p.y += p.s;
                p.x += Math.sin(p.y * 0.02);
                p.rot += 0.01;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            }
        }

        draw();
    }
    
    if (THEME === "sakura") {
        COUNT = 80;
        createParticles();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255,182,193,0.9)";

            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2);
                ctx.fill();
            }

            update();
            requestAnimationFrame(draw);
        }

        function update() {
            for (const p of particles) {
                p.y += p.s;
                p.x += Math.sin(p.y * 0.015);

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            }
        }

        draw();
    }
    
});