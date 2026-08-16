document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeButtons = [
    document.getElementById('themeToggle'),
    document.getElementById('mobileThemeToggle')
  ].filter(Boolean);
  const themeTexts = document.querySelectorAll('.theme-text');
  const nav = document.querySelector('.nav');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function refreshIcons() {
    if (window.feather) {
      window.feather.replace();
    }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeTexts.forEach(function (themeText) {
      themeText.textContent = theme === 'day' ? 'Night' : 'Day';
    });
  }

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme') || 'night';
    setTheme(currentTheme === 'night' ? 'day' : 'night');
  }

  function setMenu(open) {
    if (!mobileMenu || !menuButton) return;

    mobileMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));

    const icon = menuButton.querySelector('i');
    if (icon) {
      icon.setAttribute('data-feather', open ? 'x' : 'menu');
      refreshIcons();
    }
  }

  setTheme(localStorage.getItem('theme') || 'night');

  themeButtons.forEach(function (button) {
    button.addEventListener('click', toggleTheme);
  });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
  }

  document.querySelectorAll('.expandable-heading').forEach(function (heading) {
    heading.addEventListener('click', function () {
      const content = heading.nextElementSibling;
      if (content && content.classList.contains('expandable-content')) {
        content.classList.toggle('expanded');
      }
    });
  });

  document.querySelectorAll('.project-card, .blog-card').forEach(function (card, index) {
    if (!card.dataset.index) {
      card.dataset.index = '//' + String(index + 1).padStart(2, '0');
    }
  });

  const lightboxLinks = document.querySelectorAll('[data-lightbox="image"]');
  let lightbox = null;
  let lightboxImage = null;

  function ensureLightbox() {
    if (lightbox) return;

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');

    lightboxImage = document.createElement('img');
    lightboxImage.alt = '';

    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.setAttribute('aria-label', 'Close image preview');

    lightbox.appendChild(lightboxImage);
    lightbox.appendChild(closeButton);
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox || event.target === closeButton) {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, alt) {
    ensureLightbox();
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('open');
    lightboxImage.removeAttribute('src');
  }

  lightboxLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const href = link.getAttribute('href') || '';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const image = link.querySelector('img');
      const src = link.dataset.src || (image ? image.currentSrc || image.src : '');

      if (!isExternal && src) {
        event.preventDefault();
        openLightbox(src, image ? image.alt : '');
      }
    });
  });

  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }

  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px'
    });

    document.querySelectorAll('.project-card, .blog-card, .feature-card, .hero-text, .hero-image, section > h2').forEach(function (element) {
      element.classList.add('reveal-item');
      fadeObserver.observe(element);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  function createSignalNote() {
    let note = document.querySelector('.signal-note');
    if (note) return note;

    note = document.createElement('div');
    note.className = 'signal-note';
    note.setAttribute('aria-live', 'polite');
    document.body.appendChild(note);
    return note;
  }

  let signalTimer = null;
  function showSignalNote(message) {
    const note = createSignalNote();
    note.textContent = message;
    note.classList.add('visible');
    clearTimeout(signalTimer);
    signalTimer = window.setTimeout(function () {
      note.classList.remove('visible');
    }, 2200);
  }

  function toggleSignalMode() {
    const isActive = root.dataset.signal === 'active';
    if (isActive) {
      delete root.dataset.signal;
      showSignalNote('Signal mode off');
    } else {
      root.dataset.signal = 'active';
      showSignalNote('Signal mode');
    }
  }

  function toggleGridMode() {
    const isActive = root.dataset.grid === 'awake';
    if (isActive) {
      delete root.dataset.grid;
      showSignalNote('Grid quiet');
    } else {
      root.dataset.grid = 'awake';
      showSignalNote('Grid awake');
    }
  }

  const logo = document.querySelector('.logo-container');
  let logoClicks = 0;
  let logoClickTimer = null;
  if (logo) {
    logo.addEventListener('click', function () {
      logoClicks += 1;
      clearTimeout(logoClickTimer);
      logoClickTimer = window.setTimeout(function () {
        logoClicks = 0;
      }, 1200);

      if (logoClicks >= 5) {
        logoClicks = 0;
        toggleSignalMode();
      }
    });
  }

  let keyBuffer = '';
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeLightbox();
      setMenu(false);
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
    keyBuffer = (keyBuffer + event.key.toLowerCase()).slice(-12);
    if (keyBuffer.includes('signal')) {
      keyBuffer = '';
      toggleSignalMode();
    } else if (keyBuffer.includes('grid')) {
      keyBuffer = '';
      toggleGridMode();
    }
  });

  let fieldMarkCount = 0;
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (event.button !== 0 || event.defaultPrevented) return;
    if (target.closest('a, button, input, textarea, select, iframe, #lightbox, .project-card, .blog-card, .feature-card')) return;
    if (event.clientY < 72) return;

    const mark = document.createElement('span');
    mark.className = 'field-mark';
    mark.textContent = fieldMarkCount % 2 === 0 ? '+' : '.';
    mark.style.left = event.clientX + 'px';
    mark.style.top = event.clientY + 'px';
    document.body.appendChild(mark);

    window.setTimeout(function () {
      mark.remove();
    }, 1500);

    fieldMarkCount += 1;
    if (fieldMarkCount % 7 === 0) {
      root.dataset.grid = 'awake';
      showSignalNote('Grid marked');
    }
  });

  const locationTime = document.querySelector('[data-location-time]');
  if (locationTime) {
    const originalLabel = locationTime.textContent;
    locationTime.addEventListener('click', function () {
      const berlinTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date());

      locationTime.textContent = 'Berlin / ' + berlinTime;
      window.setTimeout(function () {
        locationTime.textContent = originalLabel;
      }, 2600);
    });
  }

  const signalField = document.querySelector('[data-signal-field]');
  if (signalField) {
    const ctx = signalField.getContext('2d');
    if (ctx) {
      const desktopSignal = window.matchMedia('(min-width: 821px)');
      let signalAnimation = null;
      let signalWidth = 0;
      let signalHeight = 0;
      let phase = 0;

    function colorValue(name, fallback) {
      return getComputedStyle(root).getPropertyValue(name).trim() || fallback;
    }

    function resizeSignalField() {
      const rect = signalField.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      signalWidth = Math.max(1, Math.round(rect.width));
      signalHeight = Math.max(1, Math.round(rect.height));
      signalField.width = Math.round(signalWidth * ratio);
      signalField.height = Math.round(signalHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawSignalField(animated) {
      const textColor = colorValue('--color-text', '#f2f2ee');
      const mutedColor = colorValue('--color-muted', '#9ca3af');
      const accentColor = colorValue('--color-highlight', '#ef4444');
      const active = root.dataset.signal === 'active' || root.dataset.grid === 'awake';
      const midY = signalHeight * 0.5;
      const columns = 9;
      const rows = 7;

      ctx.clearRect(0, 0, signalWidth, signalHeight);
      ctx.lineWidth = 1;

      ctx.globalAlpha = active ? 0.2 : 0.12;
      ctx.strokeStyle = accentColor;
      for (let i = 1; i < columns; i += 1) {
        const x = (signalWidth / columns) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, signalHeight);
        ctx.stroke();
      }
      for (let i = 1; i < rows; i += 1) {
        const y = (signalHeight / rows) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(signalWidth, y);
        ctx.stroke();
      }

      for (let layer = 0; layer < 4; layer += 1) {
        const amp = signalHeight * (0.1 + layer * 0.022);
        const frequency = 1.15 + layer * 0.44;
        const drift = phase * (0.55 + layer * 0.13);
        ctx.beginPath();
        for (let x = 0; x <= signalWidth; x += 4) {
          const t = x / signalWidth;
          const y = midY
            + Math.sin(t * Math.PI * 2 * frequency + drift) * amp
            + Math.sin(t * Math.PI * 2 * (frequency * 2.7) - drift * 0.58) * amp * 0.28
            + (layer - 1.5) * signalHeight * 0.08;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.globalAlpha = layer === 0 ? 0.62 : 0.32;
        ctx.strokeStyle = layer === 0 ? textColor : mutedColor;
        ctx.lineWidth = layer === 0 ? 1.35 : 0.9;
        ctx.stroke();
      }

      ctx.globalAlpha = active ? 0.82 : 0.48;
      ctx.fillStyle = accentColor;
      for (let i = 0; i < 18; i += 1) {
        const t = i / 17;
        const x = signalWidth * (0.08 + t * 0.84);
        const y = midY + Math.sin(t * Math.PI * 4.2 + phase) * signalHeight * 0.22;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }

      ctx.globalAlpha = active ? 0.16 : 0.08;
      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      const scanX = animated ? ((phase * 38) % (signalWidth + 120)) - 60 : signalWidth * 0.66;
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX + signalHeight * 0.26, signalHeight);
      ctx.stroke();

      ctx.globalAlpha = 1;
      if (animated) {
        phase += active ? 0.022 : 0.012;
        signalAnimation = window.requestAnimationFrame(function () {
          drawSignalField(desktopSignal.matches && !prefersReducedMotion);
        });
      }
    }

    function startSignalField() {
      if (signalAnimation) {
        window.cancelAnimationFrame(signalAnimation);
      }
      resizeSignalField();
      drawSignalField(desktopSignal.matches && !prefersReducedMotion);
    }

    startSignalField();
    window.addEventListener('resize', startSignalField, { passive: true });
    if (desktopSignal.addEventListener) {
      desktopSignal.addEventListener('change', startSignalField);
    } else if (desktopSignal.addListener) {
      desktopSignal.addListener(startSignalField);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && signalAnimation) {
        window.cancelAnimationFrame(signalAnimation);
        signalAnimation = null;
      } else if (!document.hidden) {
        startSignalField();
      }
    });
    }
  }

  if (window.innerWidth >= 768 && !prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame = null;
    let width = 0;
    let height = 0;

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(28, Math.max(12, Math.floor((width * height) / 52000)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.2 + 0.5
        };
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(root).getPropertyValue('--color-highlight').trim() || '#ef4444';
      ctx.globalAlpha = root.dataset.signal === 'active' ? 0.44 : 0.2;

      particles.forEach(function (particle) {
        particle.x = (particle.x + particle.vx + width) % width;
        particle.y = (particle.y + particle.vy + height) % height;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      } else if (!document.hidden) {
        drawParticles();
      }
    });
  }

  refreshIcons();
});


//making Glyphs for morphing text
const randomGlyphs = "#$%&*+/<=>?[]{}01";

const morphText = (element, phrases) => {
  if (!(element instanceof HTMLElement) || phrases.length < 2) return;
  let phraseIndex = 0;

  const render = (nextText) => {
    const previousText = element.textContent ?? "";
    const length = Math.max(previousText.length, nextText.length);
    let step = 0;
    const steps = 18;

    const timer = window.setInterval(() => {
      const text = Array.from({ length }, (_, index) => {
        if (index < (step / steps) * length) return nextText[index] ?? "";
        if (Math.random() > 0.52) return randomGlyphs[Math.floor(Math.random() * randomGlyphs.length)];
        return previousText[index] ?? "";
      }).join("");

      element.textContent = text;
      step += 1;

      if (step > steps) {
        window.clearInterval(timer);
        element.textContent = nextText;
      }
    }, 70);
  };

  const instanceDelay = parseInt(element.getAttribute('data-delay') ?? '0', 10) || 0;

  window.setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    render(phrases[phraseIndex]);

    window.setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      render(phrases[phraseIndex]);
    }, 5600);
  }, instanceDelay);
};
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("[data-morph-text]").forEach((element) => {

    const phrases = element.dataset.phrases
      ?.split("|")
      .map(phrase => phrase.trim())
      .filter(Boolean) ?? [];

    morphText(element, phrases);

  });

});