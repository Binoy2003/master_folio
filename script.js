/**
 * Binoy Sarker — Personal Portfolio
 * Vanilla JavaScript interactions, scroll animations, modals, GitHub integration, and form handling.
 */

// ==========================================================================
// CONFIGURATION & INTEGRATION ENDPOINTS
// ==========================================================================
/**
 * Backend / Webhook endpoint for the "Share Your Research Idea" form.
 * To enable live persistent submissions or database storage, set your endpoint URL here:
 * e.g., 'https://formspree.io/f/YOUR_FORM_ID' or 'https://api.yourdomain.com/research-ideas'
 * When left empty (''), the form performs full client-side validation and explains the setup transparently.
 */
const RESEARCH_IDEA_ENDPOINT = '';

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
      threshold: 0.1,
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
      threshold: 0.25
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
          <li>Recent Exploration: Bioinformatics & Machine Learning Inquiry</li>
        </ul>
        <p><em>Curriculum progresses through fundamental computer science principles toward specialized electives in computational biology, data analysis, and artificial intelligence.</em></p>
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

  // 8. Copy Contact Email
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = emailText.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Email copied to clipboard: ' + textToCopy);
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
      showToast('Email copied to clipboard: ' + text);
      if (copyBtn) {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      }
    } catch (err) {
      showToast('Contact email: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // 9. Share Your Research Idea Form Handler
  const ideaForm = document.getElementById('research-idea-form');
  const ideaFeedback = document.getElementById('idea-feedback');
  const ideaSubmitBtn = document.getElementById('idea-submit-btn');
  let isSubmittingIdea = false;

  if (ideaForm) {
    ideaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmittingIdea) return; // Prevent duplicate submission

      const nameInput = document.getElementById('idea-name');
      const emailInput = document.getElementById('idea-email');
      const titleInput = document.getElementById('idea-title');
      const areaSelect = document.getElementById('idea-area');
      const stageSelect = document.getElementById('idea-stage');
      const descInput = document.getElementById('idea-description');
      const linkInput = document.getElementById('idea-link');

      const nameError = document.getElementById('idea-name-error');
      const emailError = document.getElementById('idea-email-error');
      const titleError = document.getElementById('idea-title-error');
      const areaError = document.getElementById('idea-area-error');
      const descError = document.getElementById('idea-description-error');
      const linkError = document.getElementById('idea-link-error');

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

      // Title validation
      if (!titleInput.value.trim()) {
        titleError.removeAttribute('hidden');
        isValid = false;
      } else {
        titleError.setAttribute('hidden', '');
      }

      // Area validation
      if (!areaSelect.value) {
        areaError.removeAttribute('hidden');
        isValid = false;
      } else {
        areaError.setAttribute('hidden', '');
      }

      // Description validation
      if (!descInput.value.trim()) {
        descError.removeAttribute('hidden');
        isValid = false;
      } else {
        descError.setAttribute('hidden', '');
      }

      // Optional Link validation (if provided)
      const linkVal = linkInput.value.trim();
      if (linkVal) {
        try {
          const urlObj = new URL(linkVal);
          if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            throw new Error('Invalid protocol');
          }
          linkError.setAttribute('hidden', '');
        } catch (_) {
          linkError.removeAttribute('hidden');
          isValid = false;
        }
      } else {
        linkError.setAttribute('hidden', '');
      }

      if (!isValid) return;

      const submissionPayload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        title: titleInput.value.trim(),
        area: areaSelect.value,
        stage: stageSelect.value || 'Not specified',
        description: descInput.value.trim(),
        link: linkVal || 'None provided',
        submittedAt: new Date().toISOString()
      };

      // Handle Live Endpoint vs. Transparent Demo Mode
      if (RESEARCH_IDEA_ENDPOINT && RESEARCH_IDEA_ENDPOINT.trim() !== '') {
        isSubmittingIdea = true;
        setButtonLoading(ideaSubmitBtn, true, 'Submitting Idea...');

        try {
          const response = await fetch(RESEARCH_IDEA_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(submissionPayload)
          });

          if (response.ok) {
            ideaFeedback.innerHTML = `
              <strong>Research Idea Submitted Successfully:</strong><br>
              Thank you, <em>${escapeHTML(submissionPayload.name)}</em>. Your research idea "<strong>${escapeHTML(submissionPayload.title)}</strong>" in <em>${escapeHTML(submissionPayload.area)}</em> has been received. We look forward to exploring this collaborative direction.
            `;
            ideaFeedback.removeAttribute('hidden');
            ideaForm.reset();
            showToast('Research idea transmitted successfully.');
          } else {
            throw new Error(`Submission failed with status: ${response.status}`);
          }
        } catch (err) {
          ideaFeedback.innerHTML = `
            <strong>Submission Service Error:</strong><br>
            Unable to connect to the configured endpoint. Error: ${escapeHTML(err.message)}. Please verify your endpoint configuration in <code>script.js</code> or reach out directly at <a href="mailto:binoysarker2003@gmail.com" style="color: #FFFFFF; text-decoration: underline;">binoysarker2003@gmail.com</a>.
          `;
          ideaFeedback.removeAttribute('hidden');
        } finally {
          isSubmittingIdea = false;
          setButtonLoading(ideaSubmitBtn, false, 'Submit Research Idea');
        }
      } else {
        // Honest, transparent feedback when no backend service is configured yet
        ideaFeedback.innerHTML = `
          <strong>Research Idea Validated (Ready for Backend Integration):</strong><br>
          Thank you, <em>${escapeHTML(submissionPayload.name)}</em>! Your proposal "<strong>${escapeHTML(submissionPayload.title)}</strong>" in the domain <em>${escapeHTML(submissionPayload.area)}</em> has passed all client-side validation checks.<br><br>
          <span style="color: #A0A0A0; font-size: 0.85rem;">
            <em>Notice:</em> A live backend endpoint or webhook is not currently connected in this static setup. To automatically collect submissions or post them to a public community research board, configure <code>RESEARCH_IDEA_ENDPOINT</code> at the top of <code>script.js</code> (e.g., Formspree, Supabase, or a serverless function).
          </span>
        `;
        ideaFeedback.removeAttribute('hidden');
        ideaForm.reset();
        showToast('Idea validated. Submission endpoint required for live persistence.');
      }
    });
  }

  // 10. Contact Form Validation
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
            Thank you, <em>${escapeHTML(userName)}</em>. As indicated in the notice above, this site currently operates as a static front-end. For direct inquiries, feel free to email <a href="mailto:binoysarker2003@gmail.com" style="color: #FFFFFF; text-decoration: underline;">binoysarker2003@gmail.com</a> directly or connect this form to a backend service such as Formspree.
          `;
          formFeedback.removeAttribute('hidden');
        }
        contactForm.reset();
        showToast('Demo submission recorded.');
      }
    });
  }

  // 11. Optional Client-Side GitHub API Enrichment
  // Gracefully attempts to fetch latest repositories without throwing errors if rate-limited or offline
  async function enrichGitHubProjects() {
    try {
      const response = await fetch('https://api.github.com/users/Binoy2003/repos?sort=updated&per_page=8', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!response.ok) return; // Rate-limited or non-200: keep pre-rendered HTML intact

      const repos = await response.json();
      if (!Array.isArray(repos) || repos.length === 0) return;

      // Ensure that verified repository links have correct star count or fresh timestamps if available
      repos.forEach(repo => {
        if (!repo.name) return;
        const matchingLink = document.querySelector(`a[href*="${repo.name}"]`);
        if (matchingLink && repo.stargazers_count > 0) {
          const card = matchingLink.closest('.project-card');
          if (card) {
            const badge = card.querySelector('.project-year');
            if (badge && !badge.textContent.includes('★')) {
              badge.textContent += ` · ★ ${repo.stargazers_count}`;
            }
          }
        }
      });
    } catch (_) {
      // Graceful fallback: pre-rendered HTML repository cards remain completely intact
    }
  }

  enrichGitHubProjects();

  // Helper functions
  function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    const btnText = btn.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = text;
    } else {
      btn.textContent = text;
    }
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
