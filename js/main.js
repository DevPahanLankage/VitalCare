// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".main-header");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "var(--shadow-md)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.9)";
    header.style.boxShadow = "var(--shadow-sm)";
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      navLinks.classList.remove("active");
    }
  });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

function reveal() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
reveal(); // Initial check

// Tree Donation Counter
let treesPlanted = 0;
const treesCounter = document.getElementById("trees-planted");
const donationButtons = document.querySelectorAll(".donation-btn");
const paymentForm = document.getElementById("payment-form");

// Initialize Stripe
const stripe = Stripe("your_publishable_key");
const elements = stripe.elements();

// Create payment form elements
const card = elements.create("card", {
  style: {
    base: {
      fontSize: "16px",
      color: "#003366",
      "::placeholder": {
        color: "#94a3b8",
      },
      iconColor: "#00A1E4",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
});

card.mount(".card-element");

// Animate counter
function animateCounter(startValue, endValue, duration = 1000) {
  const increment = endValue - startValue;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentCount = Math.floor(startValue + increment * progress);
    treesCounter.textContent = currentCount;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      treesPlanted = endValue;
    }
  }

  requestAnimationFrame(update);
}

let selectedAmount = 0;
let treesToPlant = 0;

// Handle donation button clicks
donationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Reset previous errors
    card.clear();

    const amount = button.dataset.amount;
    if (amount === "custom") {
      const customAmount = prompt("Enter custom amount in USD:");
      if (customAmount && !isNaN(customAmount) && customAmount > 0) {
        selectedAmount = parseFloat(customAmount);
        treesToPlant = Math.floor(selectedAmount / 5); // $5 per tree
        showPaymentForm();
      }
    } else {
      selectedAmount = parseFloat(amount);
      treesToPlant = Math.floor(selectedAmount / 5); // $5 per tree
      showPaymentForm();
    }
  });
});

function showPaymentForm() {
  paymentForm.classList.remove("hidden");
  // Scroll to payment form
  paymentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Handle payment form submission
const donateButton = paymentForm.querySelector(".donate-submit-btn");

donateButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Disable button and show loading state
  donateButton.disabled = true;
  const originalText = donateButton.innerHTML;
  donateButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Processing...';

  try {
    // Here you would typically:
    // 1. Create a payment intent on your server
    // 2. Confirm the payment with Stripe
    // For demo purposes, we'll simulate a successful payment
    await simulatePaymentProcess();

    // Only update counter after successful payment
    animateCounter(treesPlanted, treesPlanted + treesToPlant);

    // Show success message
    alert(
      `Thank you for your donation! ${treesToPlant} trees will be planted.`
    );

    // Reset form
    card.clear();
    paymentForm.classList.add("hidden");
  } catch (error) {
    alert("Payment failed. Please try again.");
  } finally {
    // Reset button state
    donateButton.disabled = false;
    donateButton.innerHTML = originalText;
  }
});

// Simulate payment process (replace with actual Stripe payment)
function simulatePaymentProcess() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() < 0.9) {
        resolve();
      } else {
        reject(new Error("Payment failed"));
      }
    }, 2000);
  });
}

// Add card validation feedback
card.addEventListener("change", function (event) {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Contact Form Handling
const mainContactForm = document.querySelector(".contact-form");
if (mainContactForm) {
  mainContactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Animate submit button
    const submitBtn = mainContactForm.querySelector('button[type="submit"]');
    submitBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      submitBtn.style.transform = "scale(1)";
    }, 200);

    // For demo purposes:
    alert("Thank you for your message! We will get back to you soon.");
    mainContactForm.reset();
  });
}

// Chat Widget Functionality
const chatWidget = document.querySelector(".chat-widget");
if (chatWidget) {
  chatWidget.addEventListener("click", () => {
    showNotification("Our chat service will be available soon!", "info");
  });

  // Subtle bounce animation every 30 seconds
  setInterval(() => {
    chatWidget.style.animation = "bounce 0.5s ease";
    setTimeout(() => {
      chatWidget.style.animation = "";
    }, 500);
  }, 30000);
}

// Add keyframe animation for bounce
const style = document.createElement("style");
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        background: var(--color-white);
        box-shadow: var(--shadow-md);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        z-index: 9999;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background: #10B981;
        color: white;
    }
    
    .notification.error {
        background: #EF4444;
        color: white;
    }
`;

document.head.appendChild(style);

// Newsletter Subscription
async function storeNewsletterSubscription(email) {
  // Implementation depends on your backend
  // This is a placeholder
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (email) {
        resolve();
      } else {
        reject(new Error("Invalid email"));
      }
    }, 1000);
  });
}

// Tree Counter Animation
function animateTreeCounter() {
  const counter = document.getElementById("policy-trees-count");
  const target = parseInt(counter.innerText.replace(",", ""));
  let current = 0;
  const increment = target / 100;
  const duration = 2000; // 2 seconds
  const interval = duration / 100;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.innerText = target.toLocaleString();
      clearInterval(timer);
    } else {
      counter.innerText = Math.floor(current).toLocaleString();
    }
  }, interval);
}

// Initialize counter animation when element is in view
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateTreeCounter();
        observer.unobserve(entry.target);
      }
    });
  });

  const counter = document.getElementById("policy-trees-count");
  if (counter) {
    observer.observe(counter);
  }
});
