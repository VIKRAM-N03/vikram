document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════
     GITHUB IMAGE LOADER
     Probes each URL — loads if found, silently skips if missing
  ══════════════════════════════════════════════════════════ */
  const GH = window.GH;

  function ghLoad(el, file, onSuccess) {
    if (!el || !GH) return;
    const p = new Image();
    p.onload = () => {
      if (el.tagName === 'image') {        // SVG <image>
        el.setAttribute('href', GH.url(file));
        el.style.display = '';
      } else {                             // HTML <img>
        el.src = GH.url(file);
        el.classList.add('loaded');
      }
      if (onSuccess) onSuccess(el);
    };
    p.onerror = () =>
      console.info(`[GH Images] Missing: images/${file}  →  add it to your repo.`);
    p.src = GH.url(file);
  }

  // Hero avatar  →  images/profile1.png
  const avImg      = document.getElementById('avImg');
  const avFallback = document.getElementById('avFallback');
  ghLoad(avImg, 'profile1.png', () => {      // ✅ changed
    if (avFallback) avFallback.style.display = 'none';
  });

  // About photo  →  images/profile1.png
  const apPhoto = document.getElementById('apPhoto');
  ghLoad(apPhoto, 'profile1.png', el => {    // ✅ changed
    const wrap = document.getElementById('apWrap');
    if (wrap) wrap.classList.add('loaded');
  });

  // Project banners  →  images/projects/*.jpg
  document.querySelectorAll('.gh-img').forEach(img => {
    ghLoad(img, img.dataset.gh, () => {});
  });


  /* ══════════════════════════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════════════════════════ */
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });


  /* ══════════════════════════════════════════════════════════
     MATRIX CANVAS
  ══════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('matrixCanvas');
  const ctx    = canvas.getContext('2d');
  function resizeCv() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCv();
  window.addEventListener('resize', resizeCv);

  const CHARS = '01アイウエカキクケ</>{}[];:ABCDEF01'.split('');
  const COL_W = 16;
  let cols  = Math.floor(canvas.width / COL_W);
  let drops = Array.from({ length: cols }, () => Math.random() * -80);

  setInterval(() => {
    ctx.fillStyle = 'rgba(6,10,15,.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9f';
    ctx.font = '13px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      ctx.globalAlpha = Math.random() * .5 + .1;
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * COL_W, y * COL_W);
      ctx.globalAlpha = 1;
      drops[i] = (y > canvas.height / COL_W + 8 && Math.random() > .975) ? 0 : y + 1;
    });
  }, 52);


  /* ══════════════════════════════════════════════════════════
     LOADER SEQUENCE
  ══════════════════════════════════════════════════════════ */
  const loader  = document.getElementById('loader');
  const ltTyped = document.getElementById('ltTyped');
  const ltOut   = document.getElementById('ltOut');

  const CMD   = 'whoami && nmap --version && cat profile.md';
  const LINES = [
    'vikram-n',
    'Nmap 7.94SVN ( https://nmap.org )',
    '[ cybersecurity student // web security explorer ]',
    'Loading portfolio…',
    '[ ████████████████ ] 100% — done.'
  ];
  let ci = 0;

  function typeCmd() {
    if (ci < CMD.length) {
      ltTyped.textContent += CMD[ci++];
      setTimeout(typeCmd, 62);
    } else {
      printLines();
    }
  }

  let li = 0;
  function printLines() {
    if (li < LINES.length) {
      const d = document.createElement('div');
      d.textContent = LINES[li++];
      ltOut.appendChild(d);
      setTimeout(printLines, 260);
    } else {
      setTimeout(hideLoader, 600);
    }
  }

  function hideLoader() {
    gsap.to(loader, {
      opacity: 0, duration: .85, ease: 'power2.inOut',
      onComplete: () => { loader.style.display = 'none'; kickAnimations(); }
    });
  }

  setTimeout(typeCmd, 700);


  /* ══════════════════════════════════════════════════════════
     ROLE TYPER
  ══════════════════════════════════════════════════════════ */
  const ROLES = [
    'Ethical Hacker',
    'Web Security Engineer',
    'CTF Competitor',
    'Bug Bounty Hunter',
    'Secure Developer',
  ];
  const roleEl = document.getElementById('roleText');
  let ri = 0, rc = 0, del = false;

  function typeRole() {
    const cur = ROLES[ri];
    if (!del) {
      roleEl.textContent = cur.slice(0, ++rc);
      if (rc === cur.length) { del = true; setTimeout(typeRole, 1800); return; }
    } else {
      roleEl.textContent = cur.slice(0, --rc);
      if (rc === 0) { del = false; ri = (ri + 1) % ROLES.length; }
    }
    setTimeout(typeRole, del ? 38 : 78);
  }
  typeRole();


  /* ══════════════════════════════════════════════════════════
     GSAP ANIMATIONS  (run after loader hides)
  ══════════════════════════════════════════════════════════ */
  function kickAnimations() {

    // — Navbar
    gsap.from('.navbar', { y: -70, opacity: 0, duration: 1, ease: 'power3.out' });

    // — Hero
    gsap.from('.hero-eyebrow',  { opacity: 0, x: -25, duration: .9, delay: .3 });
    gsap.from('.hn',  { y: 110, opacity: 0, duration: 1.3, delay: .5, stagger: .14, ease: 'power4.out' });
    gsap.from('.hero-role',     { opacity: 0, y: 18, duration: .9, delay: .95 });
    gsap.from('.hero-desc',     { opacity: 0, y: 18, duration: .9, delay: 1.1 });
    gsap.from('.hero-btns',     { opacity: 0, y: 18, duration: .9, delay: 1.3 });
    gsap.from('.hstat',         { opacity: 0, y: 18, duration: .8, delay: 1.5, stagger: .12 });
    gsap.from('.av-frame',      { opacity: 0, scale: .88, duration: 1.2, delay: .6, ease: 'power3.out' });
    gsap.from('.av-tag',        { opacity: 0, y: 10,  duration: .8, delay: 1.0 });
    gsap.from('.hero-scroll',   { opacity: 0, duration: 1.2, delay: 2 });

    // — Scroll-triggered cards
    gsap.utils.toArray('.card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        y: 45, opacity: 0, duration: .9, delay: i * .04, ease: 'power3.out'
      });
    });

    // — Section titles
    gsap.utils.toArray('.sec-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        x: -28, opacity: 0, duration: .95, ease: 'power3.out'
      });
    });

    // — Section labels
    gsap.utils.toArray('.sec-label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        opacity: 0, x: -16, duration: .7
      });
    });

    // — Skill bars
    document.querySelectorAll('.skbar').forEach(bar => {
      const w = bar.dataset.w + '%';
      ScrollTrigger.create({
        trigger: bar, start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: w, duration: 1.25, ease: 'power2.out' })
      });
    });

    // — Stat counters
    document.querySelectorAll('.hstat-n').forEach(el => {
      const end = +el.dataset.target;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%',
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: end, duration: 2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.floor(this.targets()[0].v) + '+'; }
          });
        }
      });
    });

    // — About photo fade
    gsap.from('.ap-wrap.loaded', {
      scrollTrigger: { trigger: '#about', start: 'top 80%' },
      opacity: 0, x: -30, duration: 1, ease: 'power3.out'
    });
  }


  /* ══════════════════════════════════════════════════════════
     ACTIVE NAV LINK
  ══════════════════════════════════════════════════════════ */
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));


  /* ══════════════════════════════════════════════════════════
     MOBILE NAV TOGGLE
  ══════════════════════════════════════════════════════════ */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });


  /* ══════════════════════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });


  /* ══════════════════════════════════════════════════════════
     CONTACT FORM (mailto fallback)
  ══════════════════════════════════════════════════════════ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('cfName').value.trim();
      const email   = document.getElementById('cfEmail').value.trim();
      const subject = document.getElementById('cfSubject').value.trim();
      const msg     = document.getElementById('cfMsg').value.trim();
      if (!name || !email || !msg) {
        alert('Please fill in name, email, and message.'); return;
      }
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
      const sub  = encodeURIComponent(subject || 'Portfolio Contact');
      window.location.href = `mailto:vickyreddy2005@gmail.com?subject=${sub}&body=${body}`;
    });
  }


  /* ══════════════════════════════════════════════════════════
     PARTICLES
  ══════════════════════════════════════════════════════════ */
  particlesJS('particles-js', {
    particles: {
      number: { value: 48, density: { enable: true, value_area: 900 } },
      color: { value: ['#00ff9f', '#0066ff', '#3b9eff'] },
      shape: { type: 'circle' },
      opacity: { value: .28, random: true },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 130, color: '#0066ff', opacity: .1, width: 1 },
      move: { enable: true, speed: 1.1, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick:  { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: .45 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });

});
