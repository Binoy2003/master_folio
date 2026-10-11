/**
 * Binoy Sarker — Personal Portfolio
 * Vanilla JavaScript interactions, scroll animations, modals, and responsive features.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        mobileNav.setAttribute('hidden', '');
      } else {
        mobileNav.removeAttribute('hidden');
      }
    });

    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('hidden', '');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('hidden', '');
        mobileToggle.focus();
      }
    });
  }

  // 3. Scroll Reveal via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. Scroll Spy for Desktop Navigation
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.35
    });

    sections.forEach(section => spyObserver.observe(section));
  }

  // 5. Featured Articles Accordion / Details Drawer
  const articleButtons = document.querySelectorAll('.article-button');
  articleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const detailDrawer = button.parentElement.querySelector('.article-detail');

      // Close all other article drawers for clean editorial focus
      articleButtons.forEach(otherBtn => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherDrawer = otherBtn.parentElement.querySelector('.article-detail');
          if (otherDrawer) otherDrawer.setAttribute('hidden', '');
        }
      });

      // Toggle current
      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        if (detailDrawer) detailDrawer.setAttribute('hidden', '');
      } else {
        button.setAttribute('aria-expanded', 'true');
        if (detailDrawer) detailDrawer.removeAttribute('hidden');
      }
    });
  });

  // 6. Archive Interactive Items & Modal Dialog
  const modal = document.getElementById('archive-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalOk = document.getElementById('modal-ok-btn');

  const archiveData = {
    'academic-modal': {
      title: 'Academic Journey — UIU',
      content: `
        <p><strong>Institution:</strong> United International University (UIU), Dhaka, Bangladesh</p>
        <p><strong>Degree:</strong> Bachelor of Science in Computer Science and Engineering (Undergraduate)</p>
        <h4>Core Focus Areas:</h4>
        <ul>
          <li>Algorithmic Problem Solving & Data Structures (C / C++)</li>
          <li>Object-Oriented System Modeling (Java)</li>
          <li>Web Standards, Modern Markup & Frontend Architecture</li>
          <li>Foundations of Probability, Discrete Mathematics & Linear Algebra</li>
        </ul>
        <p><em>Curriculum progresses through fundamental computer science principles toward specialized electives in data analysis and artificial intelligence.</em></p>
      `
    },
    'activities-modal': {
      title: 'Campus Activities & Clubs',
      content: `
        <p>Active participation in university co-curricular organizations fostering technical collaboration, peer learning, and entrepreneurial initiatives:</p>
        <h4>Club Memberships:</h4>
        <ul>
          <li><strong>UIU Data Science Club:</strong> General Member — Engaging in workshops, competitive analytical sessions, and peer discussions around dataset exploration.</li>
          <li><strong>UIU Computer Club:</strong> General Member — Participating in departmental coding challenges, software development sessions, and technology seminars.</li>
          <li><strong>UIU Entrepreneur Development Forum:</strong> General Member — Exploring innovation frameworks, project leadership, and real-world technology ventures.</li>
        </ul>
      `
    },
    'research-modal': {
      title: 'Research Notes & Inquiry',
      content: `
        <p>Preliminary academic exploration and independent literature reviews currently in development:</p>
        <h4>Active Inquiry Topics:</h4>
        <ul>
          <li><strong>Data Representation & Clarity:</strong> How structured data pipelines translate statistical metrics into intuitive visual and narrative formats.</li>
          <li><strong>Algorithmic Storytelling:</strong> Investigating the intersection between computational systems and public understanding through investigative feature writing.</li>
          <li><strong>Foundational Machine Learning:</strong> Documenting self-study notes on predictive modeling, regression, and data preprocessing methodologies.</li>
        </ul>
        <p><em>Formal research papers and empirical findings will be published and cataloged as undergraduate investigations progress.</em></p>
      `
    }
  };

  const interactiveRows = document.querySelectorAll('.archive-interactive');
  interactiveRows.forEach(row => {
    row.addEventListener('click', () => {
      const targetKey = row.getAttribute('data-archive-target');
      const itemData = archiveData[targetKey];
      if (itemData && modal) {
        modalTitle.textContent = itemData.title;
        modalBody.innerHTML = itemData.content;
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) modalOk.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });
  }

  // 7. Toast Notification Helper
  const toast = document.getElementById('toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.removeAttribute('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 3200);
  };

  // 8. Copy Placeholder Email
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = emailText.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Email placeholder copied to clipboard.');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 2000);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Email placeholder copied to clipboard.');
      if (copyBtn) {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      }
    } catch (err) {
      showToast('Could not copy automatically. Email: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // 9. Contact Form Validation and Mock Submission
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const subjectError = document.getElementById('subject-error');
      const messageError = document.getElementById('message-error');

      let isValid = true;

      // Name validation
      if (!nameInput.value.trim()) {
        nameError.removeAttribute('hidden');
        isValid = false;
      } else {
        nameError.setAttribute('hidden', '');
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailError.removeAttribute('hidden');
        isValid = false;
      } else {
        emailError.setAttribute('hidden', '');
      }

      // Subject validation
      if (!subjectInput.value.trim()) {
        subjectError.removeAttribute('hidden');
        isValid = false;
      } else {
        subjectError.setAttribute('hidden', '');
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageError.removeAttribute('hidden');
        isValid = false;
      } else {
        messageError.setAttribute('hidden', '');
      }

      if (isValid) {
        const userName = nameInput.value.trim();
        if (formFeedback) {
          formFeedback.innerHTML = `
            <strong>Message Received in Demo Interface:</strong><br>
            Thank you, <em>${escapeHTML(userName)}</em>. As indicated in the notice above, this site currently operates as a static front-end. To route direct emails to your actual inbox, connect this form to a backend service such as Formspree or Netlify Forms.
          `;
          formFeedback.removeAttribute('hidden');
        }
        contactForm.reset();
        showToast('Demo submission recorded.');
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});

