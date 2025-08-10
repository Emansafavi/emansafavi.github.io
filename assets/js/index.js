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
});