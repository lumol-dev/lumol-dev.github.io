// document.addEventListener("DOMContentLoaded", () => {
//   const faders = document.querySelectorAll('.fade-in, .fade-fade');

//   const appearOptions = {
//     threshold: 0.1,
//     rootMargin: "0px 0px -50px 0px"
//   };

//   const appearOnScroll = new IntersectionObserver((entries, observer) => {
//     entries.forEach(entry => {
//       if (!entry.isIntersecting) return;
//       entry.target.classList.add('visible');
//       observer.unobserve(entry.target);
//     });
//   }, appearOptions);

//   faders.forEach(fader => {
//     appearOnScroll.observe(fader);
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.scroll-fade');

  function updateScrollFade() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      const top = Math.max(0, rect.top);
      const bottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, bottom - top);
      const ratio = visibleHeight / rect.height;

      const fadeStart = 0.25;
      const fadeEnd = 0.75;

      let opacity = (ratio - fadeStart) / (fadeEnd - fadeStart);
      opacity = Math.min(1, Math.max(0, opacity));

      el.style.opacity = opacity;

      // ✅ Toggle .visible for transform animation
      if (opacity > 0.01) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  window.addEventListener('scroll', updateScrollFade);
  window.addEventListener('resize', updateScrollFade);
  updateScrollFade();
});