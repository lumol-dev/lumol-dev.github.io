// Initialize Stripe
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

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

  // Checkout button handler
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      const quantity = parseInt(quantityInput.value) || 1;
      const subtotal = quantity * basePrice;
      let total = subtotal;
      
      if (quantity >= 3) {
        total -= 20;
      }
      
      // Create checkout session
      try {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span>Processing...</span>';
        
        // You'll need to create a backend endpoint to create the Stripe checkout session
        // This is a placeholder for the actual implementation
        const response = await fetch('/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: quantity,
            price: total
          })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id
        });
        
        if (result.error) {
          alert(result.error.message);
          checkoutBtn.disabled = false;
          checkoutBtn.innerHTML = '<span>Checkout</span><i class="fa-solid fa-arrow-right"></i>';
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = '<span>Checkout</span><i class="fa-solid fa-arrow-right"></i>';
      }
    });
  }

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