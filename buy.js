window.addEventListener("load", () => {
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");
  const prev = document.querySelector(".arrow.left");
  const next = document.querySelector(".arrow.right");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const quantityInput = document.getElementById("quantity");
  const decreaseBtn = document.getElementById("decrease-btn");
  const increaseBtn = document.getElementById("increase-btn");
  const totalPriceElement = document.getElementById("total-price");

  let index = 0;
  const basePrice = 79;

  function updateSlide() {
    const offset = -index * (100 / 3);
    slidesContainer.style.transform = `translateX(${offset}%)`;
    
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  function updateQuantity() {
    const quantity = parseInt(quantityInput.value);
    let totalPrice = quantity * basePrice;
    
    if (quantity >= 2) {
      totalPrice -= 20;
    }
    
    totalPriceElement.textContent = totalPrice;
    
    decreaseBtn.disabled = quantity <= 1;
    increaseBtn.disabled = quantity >= 10;
  }

  function animateButton(button) {
    button.style.transform = 'scale(0.98)';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
  }

  prev.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlide();
    animateButton(prev);
  });

  next.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlide();
    animateButton(next);
  });

  thumbnails.forEach((thumbnail, i) => {
    thumbnail.addEventListener("click", () => {
      index = i;
      updateSlide();
    });
  });

  decreaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
      updateQuantity();
      animateButton(decreaseBtn);
    }
  });

  increaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1;
      updateQuantity();
      animateButton(increaseBtn);
    }
  });

  quantityInput.addEventListener("input", updateQuantity);

  updateQuantity();

  // Removed intersection observer as animations are now CSS-only and more subtle

  let autoSlideInterval = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlide();
  }, 5000);

  [prev, next, ...thumbnails].forEach(element => {
    element.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlide();
      }, 5000);
    });
  });
});
