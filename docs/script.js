// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Expand the WebApp to full height
tg.expand();

// Enable closing confirmation (optional)
tg.enableClosingConfirmation();

// Apply Telegram theme colors to the canvas background
const bgColor = tg.themeParams.bg_color || '#0f0f1a';
const textColor = tg.themeParams.text_color || '#ffffff';

// Notify Telegram that the WebApp is ready
tg.ready();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initFloatingParticles();
});

// Floating background particles
class FloatingParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Click effect particles
class ClickParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.opacity = 1;
        this.hue = Math.random() * 60 + 180; // Blue to cyan range
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        this.size *= 0.98;
        this.opacity -= 0.015;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${this.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Ripple effect (Heart shape)
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = 80;
        this.opacity = 1;
        this.hue = Math.random() * 60 + 300; // Pink to magenta range
    }

    update() {
        this.size += 3;
        this.opacity -= 0.015;
    }

    drawHeart(x, y, size) {
        ctx.beginPath();

        // Use parametric heart equation for perfect heart shape
        for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
            const heartX = size * 0.5 * 16 * Math.pow(Math.sin(t), 3);
            const heartY = -size * 0.5 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            if (t === 0) {
                ctx.moveTo(x + heartX / 16, y + heartY / 16);
            } else {
                ctx.lineTo(x + heartX / 16, y + heartY / 16);
            }
        }

        ctx.closePath();
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = `hsl(${this.hue}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 70%, 60%)`;
        this.drawHeart(this.x, this.y, this.size);
        ctx.stroke();
        ctx.restore();
    }
}

let floatingParticles = [];
let clickParticles = [];
let ripples = [];

function initFloatingParticles() {
    floatingParticles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < particleCount; i++) {
        floatingParticles.push(new FloatingParticle());
    }
}

function createClickEffect(x, y) {
    // Create particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        clickParticles.push(new ClickParticle(x, y));
    }

    // Create ripple
    ripples.push(new Ripple(x, y));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floating particles
    floatingParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();

        if (ripples[i].opacity <= 0 || ripples[i].size >= ripples[i].maxSize) {
            ripples.splice(i, 1);
        }
    }

    // Draw click particles
    for (let i = clickParticles.length - 1; i >= 0; i--) {
        clickParticles[i].update();
        clickParticles[i].draw();

        if (clickParticles[i].opacity <= 0) {
            clickParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Event listeners
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener('click', (e) => {
    if (!isMouseDown) {
        createClickEffect(e.clientX, e.clientY);
    }
});

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    createClickEffect(e.clientX, e.clientY);
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create particles along the drag path
        if (distance > 10) {
            createClickEffect(e.clientX, e.clientY);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    for (let touch of e.touches) {
        createClickEffect(touch.clientX, touch.clientY);
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let touch of e.touches) {
        createClickEffect(touch.clientX, touch.clientY);
    }
});

// Initialize and start animation
initFloatingParticles();
animate();
