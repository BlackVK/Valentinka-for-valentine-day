const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Инициализация параметров
let particleCount;
let size;
let maxDist;
let frameInterval = 1000 / 30; // Ограничение до 30 FPS
let lastFrameTime = 0;

const particles = [];
let mouseX = null;
let mouseY = null;

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Параметры для мобильных устройств
    if (canvas.width < 768) {
        particleCount = 2000; // Меньше частиц
        size = 8; // Меньше сердце
        maxDist = 50; // Радиус взаимодействия
    } else if (canvas.width < 1200) {
        particleCount = 4000; // Среднее количество
        size = 10; // Среднее сердце
        maxDist = 75; // Радиус взаимодействия
    } else {
        particleCount = 7000; // Оригинальное количество
        size = 15; // Оригинальный размер
        maxDist = 100; // Оригинальный радиус взаимодействия
    }

    generateParticles();
}

// Создание частиц
function createHeartShape(centerX, centerY, size) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());

    const x = size * 16 * Math.pow(Math.sin(t), 3) * r;
    const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

    return {
        x: centerX + x,
        y: centerY + y,
        originalX: centerX + x,
        originalY: centerY + y,
        size: Math.random() * 2 + 1,
        color: generateRedColor(),
    };
}

function generateRedColor() {
    return `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.5})`;
}

function generateParticles() {
    particles.length = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
        particles.push(createHeartShape(centerX, centerY, size));
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function animateParticles() {
    particles.forEach(p => {
        if (mouseX !== null && mouseY !== null) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDist) {
                const angle = Math.atan2(dy, dx);
                const force = (maxDist - distance) / maxDist;
                p.x += Math.cos(angle) * force * 10;
                p.y += Math.sin(angle) * force * 10;
            } else {
                p.x += (p.originalX - p.x) * 0.05;
                p.y += (p.originalY - p.y) * 0.05;
            }
        } else {
            p.x += (p.originalX - p.x) * 0.05;
            p.y += (p.originalY - p.y) * 0.05;
        }
    });
}

// Обработка событий мыши и сенсорного ввода
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

canvas.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
});

canvas.addEventListener('touchend', () => {
    mouseX = null;
    mouseY = null;
});

// Цикл отрисовки с ограничением FPS
function loop(timestamp) {
    if (timestamp - lastFrameTime < frameInterval) {
        requestAnimationFrame(loop);
        return;
    }
    lastFrameTime = timestamp;

    drawParticles();
    animateParticles();
    requestAnimationFrame(loop);
}

// Адаптация при изменении размера экрана
window.addEventListener('resize', setupCanvas);

// Инициализация
setupCanvas();
loop();