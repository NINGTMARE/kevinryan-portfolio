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
  }

  // Load saved language or default to English
  const savedLang = localStorage.getItem('lang') || 'en';
  updateLanguage(savedLang);

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

  // 8. Contact Form Submission Simulation
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('name').value;
    const emailVal = document.getElementById('email').value;
    const messageVal = document.getElementById('message').value;

    if (nameVal && emailVal && messageVal) {
      const feedback = document.createElement('div');
      feedback.style.position = 'fixed';
      feedback.style.bottom = '20px';
      feedback.style.right = '20px';
      feedback.style.background = 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)';
      feedback.style.color = '#ffffff';
      feedback.style.padding = '1rem 2rem';
      feedback.style.borderRadius = '12px';
      feedback.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.3)';
      feedback.style.fontWeight = 'bold';
      feedback.style.zIndex = '3000';
      feedback.style.fontFamily = "'Outfit', sans-serif";
      
      // Localized thanks message
      const currentLang = localStorage.getItem('lang') || 'en';
      const template = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['feedback_thanks']) || "Thank you, {name}! Message sent successfully.";
      const msg = template.replace('{name}', nameVal);
      feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;

      document.body.appendChild(feedback);
      contactForm.reset();

      // Remove after 4 seconds
      setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s ease';
        setTimeout(() => feedback.remove(), 500);
      }, 4000);
    }
  });
});
