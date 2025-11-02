document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const themeTexts = document.querySelectorAll('.theme-text');

  // Theme toggle functionality
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'night';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
  }

  function updateThemeUI(theme) {
    themeTexts.forEach(themeText => {
      themeText.textContent = theme === 'day' ? 'Night' : 'Day';
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
    const newTheme = currentTheme === 'night' ? 'day' : 'night';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
  }

  // Initialize theme
  initTheme();

  // Theme toggle event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // Mobile menu functionality
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      
      const icon = menuButton.querySelector('i');
      if (icon) {
        icon.setAttribute('data-feather', 
          mobileMenu.classList.contains('open') ? 'x' : 'menu'
        );
        feather.replace();
      }
    });
  }

  // Initialize Feather Icons
  feather.replace();

  // Expandable headings
  const expandableHeadings = document.querySelectorAll('.expandable-heading');
  expandableHeadings.forEach(heading => {
    heading.addEventListener('click', function() {
      const content = heading.nextElementSibling;
      if (content.classList.contains('expandable-content')) {
        content.classList.toggle('expanded');
      }
    });
  });
  
  // Simple Lightbox for gallery
  const galleryLinks = document.querySelectorAll('[data-lightbox="image"]');
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:1000;padding:1rem;';
  const img = document.createElement('img');
  img.style.cssText = 'max-width:90%;max-height:90%;border-radius:8px;';
  lightbox.appendChild(img);
  const close = document.createElement('button');
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close');
  close.style.cssText = 'position:absolute;top:1rem;right:1rem;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;';
  lightbox.appendChild(close);
  document.body.appendChild(lightbox);

  function openLightbox(src) {
    img.src = src;
    lightbox.style.display = 'flex';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    img.src = '';
  }

  galleryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
      const lightboxSrc = link.dataset.src || link.querySelector('img')?.src;
      if (!isExternal && lightboxSrc) {
        e.preventDefault();
        openLightbox(lightboxSrc);
      }
    });
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target === close) {
      closeLightbox();
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggle-blog');
  const blogPosts = document.getElementById('blog-posts');
  const icon = document.getElementById('toggle-icon');
  
  if (toggleBtn && blogPosts && icon) {
    toggleBtn.addEventListener('click', function() {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !expanded);
      blogPosts.style.display = expanded ? 'none' : 'block';
      icon.innerHTML = expanded ? '&#x25BC;' : '&#x25B2;';
    });
  }

  // ==========================================
  // SCROLL-TRIGGERED FADE-IN ANIMATIONS
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for grid items
        const delay = entry.target.classList.contains('stagger-item') 
          ? index * 0.1 
          : 0;
        
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay * 1000);
        
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe project cards, blog cards, and sections
  const animatedElements = document.querySelectorAll(
    '.project-card, .blog-card, section > h2, .hero-text, .hero-image'
  );
  
  animatedElements.forEach((el, index) => {
    if (el.classList.contains('project-card') || el.classList.contains('blog-card')) {
      el.classList.add('stagger-item');
    }
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
  });

  // ==========================================
  // NAVIGATION SCROLL EFFECT
  // ==========================================
  let lastScroll = 0;
  const nav = document.querySelector('.nav');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // ==========================================
  // SMOOTH UNDERLINE ANIMATION FOR NAV LINKS
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  navLinks.forEach(link => {
    link.style.position = 'relative';
    
    // Create underline element
    const underline = document.createElement('span');
    underline.style.cssText = `
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1px;
      background-color: var(--color-highlight);
      transition: width 0.3s ease;
    `;
    link.appendChild(underline);
    
    link.addEventListener('mouseenter', function() {
      underline.style.width = '100%';
    });
    
    link.addEventListener('mouseleave', function() {
      underline.style.width = '0';
    });
  });

  // ==========================================
  // PARALLAX EFFECT FOR HERO IMAGE
  // ==========================================
  const heroImage = document.querySelector('.hero-image-content');
  if (heroImage) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${rate}px)`;
      }
    }, { passive: true });
  }

  // ==========================================
  // TEXT REVEAL ANIMATION FOR HERO HEADING
  // ==========================================
  const heroHeading = document.querySelector('.hero h1');
  if (heroHeading) {
    const text = heroHeading.textContent;
    heroHeading.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + (index < words.length - 1 ? ' ' : '');
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.display = 'inline-block';
      span.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      heroHeading.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 300 + index * 100);
    });
  }

  // ==========================================
  // SMOOTH SCROLL BEHAVIOR
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ==========================================
  // BUTTON RIPPLE EFFECT
  // ==========================================
  const buttons = document.querySelectorAll('button, .btn, .project-card, .blog-card');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.3);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation CSS
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================
  // IMAGE LOADING ANIMATION
  // ==========================================
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
    }
    
    // Add subtle zoom on hover
    img.addEventListener('mouseenter', function() {
      if (!this.closest('.project-card') && !this.closest('.blog-card')) {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
      }
    });
    
    img.addEventListener('mouseleave', function() {
      if (!this.closest('.project-card') && !this.closest('.blog-card')) {
        this.style.transform = 'scale(1)';
      }
    });
  });

  // ==========================================
  // CURSOR FOLLOW EFFECT (OPTIONAL - SUBTLE)
  // ==========================================
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.5);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease, opacity 0.2s ease;
      opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    }, { passive: true });
    
    // Smooth cursor follow
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.left = cursorX - 5 + 'px';
      cursor.style.top = cursorY - 5 + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hide cursor when leaving page
    document.addEventListener('mouseleave', function() {
      cursor.style.opacity = '0';
    });
    
    // Scale up on hover for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .blog-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'rgba(239, 68, 68, 0.8)';
      });
      el.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'rgba(239, 68, 68, 0.5)';
      });
    });
  }

  // ==========================================
  // SUBTLE BACKGROUND PARTICLE ANIMATION
  // ==========================================
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (window.innerWidth > 768 && !prefersReducedMotion) { // Only on desktop to save mobile resources
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    particleCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.15;
      transition: opacity 0.3s ease;
    `;
    document.body.insertBefore(particleCanvas, document.body.firstChild);
    
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 1; // Slightly larger particles for visibility
        this.speedX = (Math.random() - 0.5) * 0.3; // Very slow movement
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.5; // Increased opacity for visibility
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = particleCanvas.width;
        if (this.x > particleCanvas.width) this.x = 0;
        if (this.y < 0) this.y = particleCanvas.height;
        if (this.y > particleCanvas.height) this.y = 0;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    // Create particles (slightly more for better visibility)
    const particleCount = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw subtle connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only draw lines for nearby particles
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(239, 68, 68, ${(1 - distance / 150) * 0.15})`; // Slightly more visible lines
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Pause animation when tab is not visible (save resources)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
    
    // Reduce opacity even more when user is scrolling (less distraction)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      particleCanvas.style.opacity = '0.08';
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        particleCanvas.style.opacity = '0.15';
      }, 500);
    }, { passive: true });
  }
});