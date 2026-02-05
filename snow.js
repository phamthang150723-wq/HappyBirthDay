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
    const THEME = "snow";

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
    

    
});