//jQuery – Automatischer Bildwechsel für Galary bilder startseite
$(document).ready(function () {
  $('#slideshow').load('galary-bilder.html');
  let currentSlide = 0;
  const slides = $('.slide');
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.fadeOut(500);
    slides.eq(index).fadeIn(500);
  }

  function showNextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function showPrevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  // Automatisch wechseln
  let autoSlide = setInterval(showNextSlide, 3000);

  // Manuelle Steuerung
  $('.next').on('click', function () {
    clearInterval(autoSlide);
    showNextSlide();
    autoSlide = setInterval(showNextSlide, 3000);
  });

  $('.prev').on('click', function () {
    clearInterval(autoSlide);
    showPrevSlide();
    autoSlide = setInterval(showNextSlide, 3000);
  });

  // Erste Slide anzeigen
  showSlide(currentSlide);
});