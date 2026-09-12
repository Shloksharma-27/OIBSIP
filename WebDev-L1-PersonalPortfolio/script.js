// Typing effect in hero section
document.addEventListener('DOMContentLoaded', () => {
  const roles = [
    'Modern Web Applications',
    'Scalable Cloud Architectures',
    'High-Performance UI/UX Systems',
    'Full-Stack Developer Platforms'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedElement = document.getElementById('typed-text');
  
  function typeRole() {
    const current = roles[roleIndex];
    if (isDeleting) {
      typedElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeRole, typeSpeed);
  }

  if (typedElement) {
    typeRole();
  }

  // Contact Form Mock Submission & Toast
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      setTimeout(() => {
        toast.className = 'form-toast success';
        toast.textContent = '✓ Thank you! Your message has been sent successfully. I will get back to you soon.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        setTimeout(() => {
          toast.className = 'form-toast';
        }, 5000);
      }, 1000);
    });
  }

  // Active Link on Scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
});
