// Layer 0: High-DPI Retina confetti canvas engine (safe in headless/Node environments).

let particles = [];
let animId = null;

function getCanvasAndCtx() {
    if (typeof document === 'undefined') return { canvas: null, ctx: null };
    const canvas = document.getElementById('celebration-canvas');
    const ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
    return { canvas, ctx };
}

function resizeCanvas() {
    if (typeof window === 'undefined') return;
    const { canvas, ctx } = getCanvasAndCtx();
    if (!canvas || !ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = window.innerWidth || 1024;
    const height = window.innerHeight || 768;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    if (typeof ctx.setTransform === 'function') {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
}

function tick() {
    if (typeof window === 'undefined') return;
    const { ctx } = getCanvasAndCtx();
    if (!ctx) return;
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.rot += p.vrot;
        p.life -= 1;

        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 30));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
    });

    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0 && typeof requestAnimationFrame === 'function') {
        animId = requestAnimationFrame(tick);
    } else {
        ctx.clearRect(0, 0, w, h);
    }
}

function launch() {
    if (typeof window === 'undefined') return;
    const { canvas, ctx } = getCanvasAndCtx();
    if (!canvas || !ctx) return;
    resizeCanvas();
    const colors = ['#C58F2A', '#C85A32', '#2E6F40', '#B91C1C', '#5C3A21'];
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    particles = Array.from({ length: 48 }, () => ({
        x: w * 0.5 + (Math.random() - 0.5) * 140,
        y: h * 0.35,
        vx: (Math.random() - 0.5) * 7,
        vy: -Math.random() * 6 - 2,
        size: Math.floor(Math.random() * 5) + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.2,
        life: 85
    }));
    if (animId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(animId);
    }
    tick();
}

export const RetinaConfetti = { launch, resizeCanvas };
