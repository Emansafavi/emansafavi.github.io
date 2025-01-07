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
