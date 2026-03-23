document.addEventListener('DOMContentLoaded', () => {

  // ─── CUSTOM CURSOR ──────────────────────────────────────────
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // ─── MATRIX CANVAS ─────────────────────────────────────────
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const cols   = Math.floor(canvas.width / 18);
  const drops  = Array(cols).fill(0).map(() => Math.random() * -100);
  const chars  = '01アイウエオカキクケコ0110</>{}[]|\\;:ABCDEFabcdef'.split('');

  function drawMatrix() {
    ctx.fillStyle = 'rgba(6,10,15,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9f';
    ctx.font = '14px Share Tech Mono, monospace';

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.globalAlpha = Math.random() * 0.6 + 0.1;
      ctx.fillText(char, i * 18, y * 18);
      ctx.globalAlpha = 1;
      drops[i] = y > canvas.height / 18 + 10 ? (Math.random() > 0.975 ? 0 : y + 1) : y + 1;
    });
  }
  setInterval(drawMatrix, 55);

  // ─── LOADING ANIMATION ──────────────────────────────────────
  const loading = document.getElementById('loading');
  const typed   = document.getElementById('typed-command');
  const output  = document.getElementById('terminal-output');

  const cmd  = "whoami && nmap --version && cat profile.md";
  const lines = [
    "vikram-n",
    "Nmap 7.94 ( https://nmap.org )",
    "[ cybersecurity student // web security explorer ]",
    "Loading portfolio...",
    "[ ████████████████████ ] 100% — Done."
  ];

  let i = 0;
  function typeCmd() {
    if (i < cmd.length) {
      typed.textContent += cmd[i++];
      setTimeout(typeCmd, 65);
    } else {
      showOutput();
    }
  }

  let lineIdx = 0;
  function showOutput() {
    if (lineIdx < lines.length) {
      const div = document.createElement('div');
      div.textContent = lines[lineIdx++];
      output.appendChild(div);
      setTimeout(showOutput, 280);
    } else {
      setTimeout(hideLoader, 700);
    }
  }

  function hideLoader() {
    gsap.to(loading, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        loading.style.display = 'none';
        startAnimations();
      }
    });
  }

  setTimeout(typeCmd, 700);

  // ─── ROLE CYCLER ────────────────────────────────────────────
  const roles = [
    "Ethical Hacker",
    "Web Security Engineer",
    "CTF Competitor",
    "Bug Bounty Hunter",
    "Secure Developer",
  ];
  const roleEl = document.getElementById('role-text');
  let rIdx = 0;
  let rChar = 0;
  let deleting = false;

  function typeRole() {
    const current = roles[rIdx];
    if (!deleting) {
      roleEl.textContent = current.slice(0, ++rChar);
      if (rChar === current.length) {
        deleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      roleEl.textContent = current.slice(0, --rChar);
      if (rChar === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRole, deleting ? 40 : 80);
  }
  typeRole();

  // ─── GSAP PAGE ANIMATIONS ───────────────────────────────────
  function startAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.navbar', {
      y: -80, opacity: 0, duration: 1.1, ease: 'power3.out'
    });

    gsap.from('.hero-eyebrow', {
      opacity: 0, x: -30, duration: 1, delay: 0.3
    });

    gsap.from('.title-line', {
      y: 120, opacity: 0, duration: 1.3, delay: 0.5,
      stagger: 0.15, ease: 'power4.out'
    });

    gsap.from('.hero-role', {
      opacity: 0, y: 20, duration: 1, delay: 0.9
    });

    gsap.from('.hero-desc', {
      opacity: 0, y: 20, duration: 1, delay: 1.1
    });

    gsap.from('.cta-buttons', {
      opacity: 0, y: 20, duration: 1, delay: 1.3
    });

    gsap.from('.hero-stats .stat', {
      opacity: 0, y: 20, duration: 0.9, delay: 1.5, stagger: 0.15
    });

    gsap.from('.scroll-indicator', {
      opacity: 0, duration: 1.2, delay: 2
    });

    // Scroll-triggered
    gsap.utils.toArray('.glass-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        y: 50, opacity: 0,
        duration: 0.9,
        delay: i * 0.06,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        x: -30, opacity: 0,
        duration: 1, ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        opacity: 0, x: -20,
        duration: 0.8
      });
    });

    // Skill bars
    gsap.utils.toArray('.skill-bar').forEach(bar => {
      const w = bar.getAttribute('data-width') + '%';
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: w, duration: 1.3, ease: 'power2.out' })
      });
    });

    // Stat counters
    gsap.utils.toArray('.stat-num').forEach(el => {
      const end = parseInt(el.getAttribute('data-count'));
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: end,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.floor(this.targets()[0].val) + '+';
            }
          });
        }
      });
    });
  }

  // ─── NAVBAR ACTIVE LINK ─────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // ─── PARTICLES ─────────────────────────────────────────────
  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 1000 } },
      color: { value: ['#00ff9f', '#0066ff', '#3b9eff'] },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 2.5, random: true },
      line_linked: {
        enable: true,
        distance: 130,
        color: '#0066ff',
        opacity: 0.12,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        random: true,
        out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 150, line_linked: { opacity: 0.5 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });

  // ─── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
