// Wait for DOM to be ready, then execute
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

function initializePage() {
  // Get elements
  const slides = document.querySelectorAll(".slide");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const quantityInput = document.getElementById("quantity");
  const qtyDisplay = document.getElementById("qty-display");
  const decreaseBtn = document.getElementById("decrease-btn");
  const increaseBtn = document.getElementById("increase-btn");
  const totalPriceElement = document.getElementById("total-price");
  const subtotalElement = document.getElementById("subtotal");
  const discountRow = document.getElementById("discount-row");

  let currentSlide = 0;
  const basePrice = 79;

  // Simple slideshow function
  function showSlide(index) {
    // Remove active class from all slides and thumbnails
    slides.forEach(slide => slide.classList.remove('active'));
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to current slide and thumbnail
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    if (thumbnails[index]) {
      thumbnails[index].classList.add('active');
    }
    
    currentSlide = index;
  }

  // Navigation functions
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // Update pricing and quantity display
  function updatePricing() {
    const quantity = parseInt(quantityInput.value) || 1;
    const subtotal = quantity * basePrice;
    let total = subtotal;
    
    // Update quantity display
    if (qtyDisplay) qtyDisplay.textContent = quantity;
    
    // Apply bulk discount
    if (quantity >= 3) {
      total -= 20;
      if (discountRow) discountRow.style.display = 'flex';
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }
    
    // Update display
    if (subtotalElement) subtotalElement.textContent = `$${subtotal}`;
    if (totalPriceElement) totalPriceElement.textContent = `$${total}`;
    
    // Update button states
    if (decreaseBtn) decreaseBtn.disabled = quantity <= 1;
    if (increaseBtn) increaseBtn.disabled = quantity >= 10;
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  // Thumbnail navigation
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => showSlide(index));
  });

  // Quantity controls
  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      const current = parseInt(quantityInput.value) || 1;
      if (current > 1) {
        quantityInput.value = current - 1;
        updatePricing();
      }
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      const current = parseInt(quantityInput.value) || 1;
      if (current < 10) {
        quantityInput.value = current + 1;
        updatePricing();
      }
    });
  }

  // No need for quantity input listener since it's hidden

  // Initialize
  showSlide(0);
  updatePricing();

  // Auto-advance slideshow every 5 seconds
  setInterval(nextSlide, 5000);
  
  // Force page load completion
  setTimeout(() => {
    if (document.readyState === 'loading') {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
    window.dispatchEvent(new Event('load'));
  }, 100);
}