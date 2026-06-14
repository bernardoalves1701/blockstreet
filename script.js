const canvas = document.getElementById("particleField");
const context = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("motion-ready");

let particles = [];
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createParticles() {
  const amount = Math.min(120, Math.max(52, Math.floor(width / 14)));
  particles = Array.from({ length: amount }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.45,
    speedX: (Math.random() - 0.5) * 0.34,
    speedY: (Math.random() - 0.5) * 0.28 - 0.08,
    alpha: Math.random() * 0.62 + 0.18,
    phase: Math.random() * Math.PI * 2,
    hue: index % 4 === 0 ? 184 : index % 4 === 1 ? 218 : 238,
  }));
}

function drawParticles(time = 0) {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.phase += 0.018;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    const pulse = 0.55 + Math.sin(particle.phase + time * 0.001) * 0.45;
    const glow = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 8
    );
    glow.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.alpha * pulse})`);
    glow.addColorStop(1, `hsla(${particle.hue}, 100%, 55%, 0)`);

    context.fillStyle = glow;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius * 8, 0, Math.PI * 2);
    context.fill();
  }

  if (!reducedMotion) {
    requestAnimationFrame(drawParticles);
  }
}

function setupRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16 }
  );

  elements.forEach((element) => observer.observe(element));
}

function init() {
  resizeCanvas();
  createParticles();
  drawParticles();
  setupRevealAnimation();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

init();
