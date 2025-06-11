window.addEventListener("load", () => {
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slides img");
  const prev = document.querySelector(".arrow.left");
  const next = document.querySelector(".arrow.right");

  let index = 0;

  function updateSlide() {
    const offset = -index * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
  }

  prev.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlide();
  });

  next.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlide();
  });
});
