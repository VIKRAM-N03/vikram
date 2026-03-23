document.addEventListener("DOMContentLoaded", () => {

  const GH = window.GH_IMAGES;

  function loadImage(el, file) {
    const url = GH.url(file);
    const img = new Image();

    img.onload = () => {
      el.src = url;
    };

    img.onerror = () => {
      el.src = "images/" + file;
    };

    img.src = url;
  }

  // Avatar fix (SVG)
  const avatar = document.getElementById("avatarImg");
  if (avatar) {
    avatar.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      GH.url("avatar.jpg")
    );
  }

  // Profile image
  const about = document.getElementById("aboutPhoto");
  if (about) loadImage(about, "profile.jpg");

  // Projects
  document.querySelectorAll(".gh-project-img").forEach(img => {
    const file = img.getAttribute("data-img");
    loadImage(img, file);
  });

  // MATRIX EFFECT
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "01";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = "rgba(6,10,15,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff9f";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
        drops[i] = 0;

      drops[i]++;
    }
  }

  setInterval(draw, 50);

  // PARTICLES
  particlesJS("particles-js", {
    particles: {
      number: { value: 40 },
      size: { value: 3 },
      move: { speed: 1 }
    }
  });

});
