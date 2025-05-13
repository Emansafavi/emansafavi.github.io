document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');

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