function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally unobserve after reveal
      // revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Auto-add reveal classes to common elements
document.querySelectorAll('.stat-item, .feature-card, .transform-card, .who-item, .pain-inner, .month-inner, .about-section, .program-header, .pt-card, .faq-item, .footer-top, .footer-bottom').forEach((el, i) => {
  el.classList.add('reveal');
  el.classList.add(`reveal-delay-${(i % 5) + 1}`);
  revealObserver.observe(el);
});

// Left/right reveals for alternating sections
document.querySelectorAll('.pt-image, .about-photo').forEach(el => {
  el.classList.add('reveal-scale');
  revealObserver.observe(el);
});

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = performance.now();
  const startValue = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(startValue + (target - startValue) * easeOutQuart);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl) {
        const text = numEl.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          // Preserve the stat-unit span, only animate the number
          const unitSpan = numEl.querySelector('.stat-unit');
          numEl.innerHTML = `<span class="counter-animated">0</span>${unitSpan ? unitSpan.outerHTML : ''}`;
          animateCounter(numEl.querySelector('.counter-animated'), target, 2000);
        }
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => counterObserver.observe(el));

// ============================================
// MOBILE MENU TOGGLE
// ============================================
(function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!mobileMenuToggle || !navMenu) return;

  function toggleMenu() {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  mobileMenuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)) {
      toggleMenu();
    }
  });
})();

// ============================================
// NAVIGATION SCROLL SPY
// ============================================
(function() {
  const navLinks = document.querySelectorAll('nav ul a[href^="#"]');
  const sections = document.querySelectorAll('section[id], div[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateActiveNav();
})();

// ============================================
// HERO PARALLAX EFFECT
// ============================================
(function() {
  const heroImg = document.querySelector('.hero-img-placeholder img');
  if (!heroImg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.15;
        heroImg.style.transform = `translateY(${rate}px) scale(1.05)`;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ============================================
// NAV BAR SHOW/HIDE ON SCROLL
// ============================================
(function() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
          nav.style.background = 'rgba(30,32,32,0.95)';
          nav.style.backdropFilter = 'blur(12px)';
          nav.style.borderBottom = '1px solid rgba(201,168,76,0.1)';
        } else {
          nav.style.background = 'transparent';
          nav.style.backdropFilter = 'none';
          nav.style.borderBottom = '1px solid transparent';
        }

        if (currentScroll > lastScroll && currentScroll > 300) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }

        nav.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, backdrop-filter 0.3s ease';
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// Testimonials Swiper
(function() {
  const track = document.querySelector('.swiper-track');
  const dots = document.querySelectorAll('.swiper-dots .dot');
  if (!track || dots.length === 0) return;

  const cards = track.querySelectorAll('.swiper-card');
  const totalUnique = cards.length / 2; // account for duplicates
  let currentIndex = 0;
  let isPaused = false;

  function updateDots(index) {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function goToSlide(index) {
    currentIndex = index % totalUnique;
    const cardWidth = cards[0].offsetWidth + 24; // 24px gap
    track.style.animation = 'none';
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots(currentIndex);
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      isPaused = true;
      setTimeout(() => { isPaused = false; }, 3000);
    });
  });

  // Update dots based on scroll position
  const swiperSection = document.querySelector('.testimonials-swiper');
  if (swiperSection) {
    swiperSection.addEventListener('mouseenter', () => { isPaused = true; });
    swiperSection.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // Auto-update dots based on animation
  setInterval(() => {
    if (!isPaused) {
      const computed = getComputedStyle(track);
      const matrix = new WebKitCSSMatrix(computed.transform);
      const x = Math.abs(matrix.m41);
      const cardWidth = cards[0].offsetWidth + 24;
      const idx = Math.round(x / cardWidth) % totalUnique;
      if (idx !== currentIndex) {
        currentIndex = idx;
        updateDots(currentIndex);
      }
    }
  }, 500);
})();

// ============================================
// GALLERY VIDEO AUTOPLAY
// ============================================
(function() {
  const galleryVideos = document.querySelectorAll('.gallery-item-video video');
  if (galleryVideos.length === 0) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        video.play().catch(() => {
          // Auto-play blocked, show poster/play button
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.3, 0.6, 1] });

  galleryVideos.forEach(video => {
    videoObserver.observe(video);

    // Hover to unmute/mute
    const item = video.closest('.gallery-item-video');
    if (item) {
      item.addEventListener('mouseenter', () => {
        video.muted = false;
        video.volume = 0.5;
      });
      item.addEventListener('mouseleave', () => {
        video.muted = true;
      });

      // Click to toggle fullscreen
      item.addEventListener('click', () => {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }
  });
})();

// Booking Form Handling
(function() {
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');

  if (!bookingForm) return;

  // Set minimum date to today
  const startDateInput = document.getElementById('startDate');
  if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);
  }

  // Form validation helper
  function validateField(field) {
    const formGroup = field.closest('.form-group');
    const isValid = field.checkValidity();

    if (isValid) {
      formGroup.classList.remove('error');
      formGroup.classList.add('valid');
    } else {
      formGroup.classList.add('error');
      formGroup.classList.remove('valid');
    }
    return isValid;
  }

  // Real-time validation on blur
  bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('touched')) {
        validateField(field);
      }
    });
    field.addEventListener('focus', () => {
      field.classList.add('touched');
    });
  });

  // Form submission
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.add('touched');
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // Shake animation for invalid form
      bookingForm.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        bookingForm.style.animation = '';
      }, 500);
      return;
    }

    // Collect form data
    const formData = new FormData(bookingForm);
    const bookingData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      coachingType: formData.get('coachingType'),
      primaryGoal: formData.get('primaryGoal'),
      trainingDays: formData.get('trainingDays'),
      preferredTime: formData.get('preferredTime'),
      startDate: formData.get('startDate'),
      message: formData.get('message'),
      submittedAt: new Date().toISOString()
    };

    // Simulate form submission (replace with actual API call)
    console.log('Booking submitted:', bookingData);

    // Show success message
    bookingForm.style.display = 'none';
    bookingSuccess.style.display = 'block';

    // Scroll to success message
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Optional: Reset form after delay
    setTimeout(() => {
      bookingForm.reset();
      bookingForm.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('valid', 'error');
      });
    }, 3000);
  });

  // Shake animation CSS injection
  if (!document.getElementById('form-animations')) {
    const style = document.createElement('style');
    style.id = 'form-animations';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      .form-group.error input,
      .form-group.error select,
      .form-group.error textarea {
        border-color: #e74c3c !important;
      }
      .form-group.valid input,
      .form-group.valid select,
      .form-group.valid textarea {
        border-color: var(--gold) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

// ============================================
// WHATSAPP POPUP TOGGLE
// ============================================
function toggleWhatsapp() {
  const popup = document.getElementById('whatsappPopup');
  if (popup) {
    popup.classList.toggle('active');
  }
}

// Auto-show WhatsApp popup after 10 seconds on first visit
(function() {
  const popup = document.getElementById('whatsappPopup');
  if (!popup || sessionStorage.getItem('whatsappSeen')) return;

  setTimeout(() => {
    popup.classList.add('active');
    sessionStorage.setItem('whatsappSeen', 'true');
  }, 10000);
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
(function() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
})();
