// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// MOBILE MENU
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('mobileClose').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('open');
});
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));



// CANVAS PARTICLES
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '74,222,128' : (Math.random() > 0.5 ? '163,230,53' : '34,197,94');
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(74,222,128,${0.05 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── TYPEWRITER ───────────────────────────────
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Next-Generation',
    'Scalable',
    'AI-Powered',
    'World-Class',
    'High-Performance',
    'Future-Ready',
  ];

  let wordIdx = 0;
  let charIdx = words[0].length;
  let deleting = false;

  function tick() {
    const current = words[wordIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        // fully typed — pause then start deleting
        setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
      setTimeout(tick, 60);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        // fully deleted — move to next word
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  // Kick off after initial display word holds for 2.2s
  setTimeout(() => { deleting = true; tick(); }, 2200);
})();

// ── HERO PARALLAX (mouse move) ───────────────
(function () {
  const hero  = document.getElementById('hero');
  const g1    = document.getElementById('glow1');
  const g2    = document.getElementById('glow2');
  const g3    = document.getElementById('glow3');
  const chips = document.querySelectorAll('.hfc');
  if (!hero) return;

  let tx = 0, ty = 0;   // target
  let cx = 0, cy = 0;   // current (lerped)
  let raf;

  hero.addEventListener('mousemove', (e) => {
    const r  = hero.getBoundingClientRect();
    // -1 … +1 relative to centre
    tx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    ty = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
  });

  hero.addEventListener('mouseleave', () => {
    tx = 0; ty = 0;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function frame() {
    cx = lerp(cx, tx, 0.06);
    cy = lerp(cy, ty, 0.06);

    // Glows — gentle drift, opposite direction for depth
    if (g1) g1.style.transform = `translate(${cx * -18}px, ${cy * -14}px)`;
    if (g2) g2.style.transform = `translate(${cx *  14}px, ${cy *  10}px)`;
    if (g3) g3.style.transform = `translate(${cx *  10}px, ${cy *  16}px)`;

    // Chips — each has its own depth multiplier
    chips.forEach(chip => {
      const d = parseFloat(chip.dataset.depth || 0.05);
      const mx = cx * d * 120;
      const my = cy * d * 80;
      // combine with the CSS float animation via additional translate
      chip.style.setProperty('--px', `${mx}px`);
      chip.style.setProperty('--py', `${my}px`);
      // We apply it via inline style on top of animation
      const base = chip._baseTransform || '';
      chip.style.marginLeft = mx + 'px';
      chip.style.marginTop  = my + 'px';
    });

    raf = requestAnimationFrame(frame);
  }
  frame();
})();

// ── HERO STAT COUNT-UP ───────────────────────
(function () {
  const suffixes = { 120: '+', 98: '%', 5: '+', 40: '+' };
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  function countUp(el) {
    const target = parseInt(el.dataset.count);
    const suffix = suffixes[target] || '';
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const inc = target / steps;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  // Trigger when stats enter viewport
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
})();

// FORM SUBMIT — Formspree
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mkoqgnkr', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#10b981,#06b6d4)';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    } else {
      const data = await res.json();
      const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
      btn.textContent = '✗ ' + msg;
      btn.style.background = 'linear-gradient(135deg,#ef4444,#f97316)';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    }
  } catch (err) {
    btn.textContent = '✗ Network Error. Try again.';
    btn.style.background = 'linear-gradient(135deg,#ef4444,#f97316)';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);
  }
}

// SMOOTH SCROLL for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
