document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher Logic
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  function setTheme(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      document.body.classList.remove('light-theme');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', theme);
  }

  // Load preferred theme or default to system/dark
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
  setTheme(currentTheme);

  // Toggle theme click handler
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    setTheme(isLight ? 'dark' : 'light');
  });

  // 2. Translations / Language Switching Logic
  function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        const translation = translations[lang][key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          if (translation.includes('<') && translation.includes('>')) {
            el.innerHTML = translation;
          } else {
            el.textContent = translation;
          }
        }
      }
    });

    // Update active class in selector buttons
    document.querySelectorAll('.lang-option').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update document language tag
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    // Update animated typewriter roles for selected language
    if (typeof resetTypewriter === 'function') {
      resetTypewriter(lang);
    }
  }

  // Language switch click handler
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      updateLanguage(targetLang);
    });
  });

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when a link is clicked
  const navItems = navLinks.querySelectorAll('a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });

  // 4. Sticky Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 5. Scroll active link updates
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.classList.add('active');
      }
    });
  });

  // 6. Skills Tabs Filter
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.skills-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // 7. Experience & Project Modals Logic
  const timelineCards = document.querySelectorAll('.timeline-card, .project-card');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  timelineCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    }
  });

  // 7b. Projects Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Contact Form Email Submission (Pure JS via Web3Forms)
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm ? (contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.submit-btn')) : null;

  function showToast(message, isError = false) {
    const existing = document.querySelector('.contact-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `contact-toast ${isError ? 'error' : 'success'}`;
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  }

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = (document.getElementById('name') ? document.getElementById('name').value : '').trim();
      const emailVal = (document.getElementById('email') ? document.getElementById('email').value : '').trim();
      const messageVal = (document.getElementById('message') ? document.getElementById('message').value : '').trim();

      if (!nameVal || !emailVal || !messageVal) return;

      const currentLang = localStorage.getItem('lang') || 'en';
      const sendingText = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['contact_form_sending']) || "Sending...";
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${sendingText}</span>`;

      try {
        const formData = new FormData(contactForm);
        formData.set("access_key", "7bf4ccc5-a3a1-45ab-9ef4-ec3ff1620575");
        formData.set("name", nameVal);
        formData.set("email", emailVal);
        formData.set("message", messageVal);
        formData.set("subject", `New Portfolio Message from ${nameVal}`);
        formData.set("from_name", nameVal);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const resData = await response.json();

        if (response.ok && (resData.success === true || resData.success === "true")) {
          const thanksTpl = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['feedback_thanks']) || "Thank you, {name}! Your message has been sent directly to my email.";
          showToast(thanksTpl.replace('{name}', nameVal), false);
          contactForm.reset();
        } else {
          const errMsg = (resData && resData.message) ? resData.message : ((typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['feedback_error']) || "Message could not be sent. Please try again.");
          showToast(errMsg, true);
        }
      } catch (error) {
        console.error("Web3Forms error:", error);
        const errTpl = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['feedback_error']) || "Something went wrong. Please try again.";
        showToast(errTpl, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  // 9. LMS Gallery Showcase Slider Controller
  const lmsSlides = document.querySelectorAll('#lms-slides .gallery-slide');
  const lmsThumbs = document.querySelectorAll('#lms-thumbnails .thumb-item');
  const lmsDots = document.querySelectorAll('#lms-dots .dot');
  const lmsPrevBtn = document.getElementById('lms-prev-btn');
  const lmsNextBtn = document.getElementById('lms-next-btn');
  const lmsAutoplayBtn = document.getElementById('lms-autoplay-btn');
  const lmsExpandBtn = document.getElementById('lms-expand-btn');
  const lmsTabBtns = document.querySelectorAll('.gallery-tab-btn');

  let currentLMSSlideIndex = 0;
  let lmsAutoplayTimer = null;
  let isLMSAutoplay = true;

  function showLMSSlide(index) {
    if (lmsSlides.length === 0) return;
    
    // Normalize index
    if (index >= lmsSlides.length) currentLMSSlideIndex = 0;
    else if (index < 0) currentLMSSlideIndex = lmsSlides.length - 1;
    else currentLMSSlideIndex = index;

    // Update slides
    lmsSlides.forEach((slide, i) => {
      if (i === currentLMSSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update thumbnails
    lmsThumbs.forEach((thumb, i) => {
      if (i === currentLMSSlideIndex) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });

    // Update dots
    lmsDots.forEach((dot, i) => {
      if (i === currentLMSSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  function nextLMSSlide() {
    showLMSSlide(currentLMSSlideIndex + 1);
  }

  function prevLMSSlide() {
    showLMSSlide(currentLMSSlideIndex - 1);
  }

  function startLMSAutoplay() {
    if (lmsAutoplayTimer) clearInterval(lmsAutoplayTimer);
    lmsAutoplayTimer = setInterval(nextLMSSlide, 4500);
    isLMSAutoplay = true;
    if (lmsAutoplayBtn) {
      lmsAutoplayBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Auto-Scroll';
    }
  }

  function stopLMSAutoplay() {
    if (lmsAutoplayTimer) clearInterval(lmsAutoplayTimer);
    lmsAutoplayTimer = null;
    isLMSAutoplay = false;
    if (lmsAutoplayBtn) {
      lmsAutoplayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto-Scroll';
    }
  }

  if (lmsPrevBtn) {
    lmsPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevLMSSlide();
      if (isLMSAutoplay) startLMSAutoplay();
    });
  }

  if (lmsNextBtn) {
    lmsNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextLMSSlide();
      if (isLMSAutoplay) startLMSAutoplay();
    });
  }

  if (lmsAutoplayBtn) {
    lmsAutoplayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLMSAutoplay) {
        stopLMSAutoplay();
      } else {
        startLMSAutoplay();
        nextLMSSlide();
      }
    });
  }

  // Thumbnails click handlers
  lmsThumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(thumb.getAttribute('data-index'), 10);
      showLMSSlide(idx);
      if (isLMSAutoplay) startLMSAutoplay();
    });
  });

  // Dots click handlers
  lmsDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showLMSSlide(idx);
      if (isLMSAutoplay) startLMSAutoplay();
    });
  });

  // Filter Tabs click handlers
  lmsTabBtns.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      lmsTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      if (filter === 'all') {
        showLMSSlide(0);
      } else {
        // Find first slide matching filter
        let targetIdx = -1;
        lmsSlides.forEach((slide, idx) => {
          if (targetIdx === -1 && slide.getAttribute('data-category') === filter) {
            targetIdx = idx;
          }
        });
        if (targetIdx !== -1) {
          showLMSSlide(targetIdx);
        }
      }
      if (isLMSAutoplay) startLMSAutoplay();
    });
  });

  // Lightbox Modal Logic
  const lightboxModal = document.getElementById('portfolio-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(src, captionText) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
  }

  if (lmsExpandBtn) {
    lmsExpandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeSlide = document.querySelector('#lms-slides .gallery-slide.active');
      if (activeSlide) {
        const img = activeSlide.querySelector('img');
        const h5 = activeSlide.querySelector('.slide-caption h5');
        if (img) {
          openLightbox(img.src, h5 ? h5.textContent : '');
        }
      }
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-overlay') || e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // 10. Mobile Touch Swipe Gestures for Gallery Slider
  const galleryViewport = document.querySelector('.gallery-viewport') || document.getElementById('lms-slides');
  if (galleryViewport) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    galleryViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    galleryViewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Only trigger if horizontal swipe is distinctly greater than vertical swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          nextLMSSlide();
        } else {
          prevLMSSlide();
        }
        if (isLMSAutoplay) startLMSAutoplay();
      }
    }
  }

  // 11. Scroll Progress Bar & Floating Back to Top Button
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function updateScrollProgress() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const progress = (window.scrollY / totalScroll) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${progress}%`;
      }
    }

    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 12. Animated Typewriter Effect on Hero Tagline
  const typingRoleEl = document.getElementById('typingRole');
  let typeTimeout = null;
  let currentRoleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function initTypewriter(lang) {
    if (!typingRoleEl) return;
    if (typeTimeout) clearTimeout(typeTimeout);

    const roles = (typeof translations !== 'undefined' && translations[lang] && translations[lang].typing_roles) || [
      "IT Specialist & Software Developer",
      "Full-Stack Web Developer (PHP & JS)",
      "System & Network Administrator",
      "Android Mobile App Developer (Java)"
    ];

    currentRoleIdx = currentRoleIdx % roles.length;
    const currentRole = roles[currentRoleIdx];

    if (!isDeleting) {
      charIdx++;
      typingRoleEl.textContent = currentRole.substring(0, charIdx);
      if (charIdx >= currentRole.length) {
        isDeleting = true;
        typeTimeout = setTimeout(() => initTypewriter(lang), 2200);
        return;
      }
      typeTimeout = setTimeout(() => initTypewriter(lang), 65);
    } else {
      charIdx--;
      typingRoleEl.textContent = currentRole.substring(0, charIdx);
      if (charIdx <= 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        typeTimeout = setTimeout(() => initTypewriter(lang), 450);
        return;
      }
      typeTimeout = setTimeout(() => initTypewriter(lang), 35);
    }
  }

  function resetTypewriter(lang) {
    if (typeTimeout) clearTimeout(typeTimeout);
    charIdx = 0;
    isDeleting = false;
    initTypewriter(lang);
  }

  // Start initial typewriter with saved language
  const initialLang = localStorage.getItem('lang') || 'en';
  resetTypewriter(initialLang);

  // Start initial autoplay
  startLMSAutoplay();
});
