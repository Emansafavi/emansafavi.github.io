// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
});
function scrollleft() {
    document.querySelector('.image-container').scrollBy({
        left: -200,
        behavior: 'smooth'
      });
}
function scrollRight() {
    document.querySelector('.image-container').scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }
  setInterval(() => {
    document.querySelector('.image-container').scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }, 600); // Adjust the interval as needed

  feather.replace();
    
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = menuButton.querySelector('i');
      icon.setAttribute('data-feather', 
        mobileMenu.classList.contains('active') ? 'x' : 'menu'
      );
      feather.replace();
    });
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.29.0/feather.min.js"></script>
