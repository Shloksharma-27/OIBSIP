// Mobile navigation menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Pricing Billing Toggle (Monthly vs Yearly)
  const billingToggle = document.getElementById('billing-toggle');
  const priceValues = document.querySelectorAll('.price-val');

  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      const isYearly = e.target.checked;
      priceValues.forEach(priceEl => {
        const val = isYearly ? priceEl.dataset.yearly : priceEl.dataset.monthly;
        priceEl.textContent = val;
      });
    });
  }

  // Sticky Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(7, 9, 14, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(7, 9, 14, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });
});
