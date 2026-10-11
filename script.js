/**
 * Binoy Sarker — Personal Portfolio
 * Vanilla JavaScript interactions, scroll animations, modals, GitHub integration, and form handling.
 */

// ==========================================================================
// FORMSPREE CONFIGURATION
// Destination: binoysarker2003@gmail.com
// Official Documentation: https://formspree.io/
// ==========================================================================
/**
 * Configuration for direct email dispatch via Formspree.
 * 
 * Replace the placeholder values with your real Formspree Form ID or full endpoint URL:
 * - contactFormEndpoint: e.g. 'https://formspree.io/f/xyzab123' (or just 'xyzab123')
 * - researchFormEndpoint: e.g. 'https://formspree.io/f/abcde789' (or just 'abcde789')
 * 
 * Note: You can create two separate forms on Formspree (recommended for separate email notifications),
 * or share a single Formspree form endpoint for both.
 */
const FORMSPREE_CONFIG = {
  contactFormEndpoint: 'https://formspree.io/f/YOUR_CONTACT_FORMSPREE_ID',
  researchFormEndpoint: 'https://formspree.io/f/YOUR_RESEARCH_FORMSPREE_ID',
};

// Resolves a form ID or URL into a full Formspree endpoint URL
function resolveFormspreeEndpoint(endpointOrId) {
  if (!endpointOrId || typeof endpointOrId !== 'string') return '';
  const trimmed = endpointOrId.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://formspree.io/f/${trimmed}`;
}

// Helper to verify whether real credentials have replaced placeholder values
function isFormspreePlaceholder(val) {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return (
    trimmed === '' ||
    trimmed.includes('YOUR_') ||
    trimmed.includes('YOUR_CONTACT_FORMSPREE_ID') ||
    trimmed.includes('YOUR_RESEARCH_FORMSPREE_ID')
  );
}

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

  // 9. Share Your Research Idea Form Handler (Formspree Integration)
  const ideaForm = document.getElementById('research-idea-form');
  const ideaFeedback = document.getElementById('idea-feedback');
  const ideaSubmitBtn = document.getElementById('idea-submit-btn');
  let isSubmittingIdea = false;

  if (ideaForm) {
    ideaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmittingIdea) return; // Prevent duplicate clicks while in progress

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
      ideaFeedback.setAttribute('hidden', '');

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

      const targetEndpoint = resolveFormspreeEndpoint(
        FORMSPREE_CONFIG.researchFormEndpoint || ideaForm.getAttribute('action')
      );

      // Check if Formspree endpoint is configured or placeholder
      if (isFormspreePlaceholder(targetEndpoint)) {
        ideaFeedback.className = 'form-feedback feedback-info';
        ideaFeedback.innerHTML = `
          <strong>Proposal Validated (Formspree Setup Step Required):</strong><br>
          Thank you, <em>${escapeHTML(nameInput.value.trim())}</em>! Your research proposal "<strong>${escapeHTML(titleInput.value.trim())}</strong>" in the domain <em>${escapeHTML(areaSelect.value)}</em> has passed all client-side validation checks.<br><br>
          To automatically route live submissions to <strong>binoysarker2003@gmail.com</strong>, configure your Formspree Form ID in <code>FORMSPREE_CONFIG</code> at the top of <code>script.js</code>:<br>
          • Replace <code>'YOUR_RESEARCH_FORMSPREE_ID'</code> with your Formspree ID (e.g. <code>https://formspree.io/f/mqkbrzen</code>).<br><br>
          <span style="color: #A0A0A0; font-size: 0.85rem;">
            Direct inquiries can also be sent directly to <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
          </span>
        `;
        ideaFeedback.removeAttribute('hidden');
        showToast('Idea validated. Enter Formspree ID in script.js to send email.');
        return;
      }

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        _replyto: emailInput.value.trim(),
        idea_title: titleInput.value.trim(),
        idea_area: areaSelect.value,
        idea_stage: stageSelect.value || 'Not specified',
        idea_description: descInput.value.trim(),
        idea_link: linkVal || 'None provided',
        _subject: `[Research Idea] ${titleInput.value.trim()} [${areaSelect.value}] - from ${nameInput.value.trim()}`,
        submitted_at: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      };

      // Live Formspree Transmission via fetch
      isSubmittingIdea = true;
      setButtonLoading(ideaSubmitBtn, true, 'Submitting Idea...');
      ideaFeedback.setAttribute('hidden', '');

      try {
        const response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          ideaFeedback.className = 'form-feedback feedback-success';
          ideaFeedback.innerHTML = `
            <strong>Research Idea Transmitted Successfully:</strong><br>
            Thank you, <em>${escapeHTML(payload.name)}</em>. Your research idea "<strong>${escapeHTML(payload.idea_title)}</strong>" in <em>${escapeHTML(payload.idea_area)}</em> has been forwarded directly to Binoy Sarker (<code>binoysarker2003@gmail.com</code>). We look forward to exploring this collaborative direction.
          `;
          ideaFeedback.removeAttribute('hidden');
          ideaForm.reset();
          showToast('Research idea transmitted to binoysarker2003@gmail.com.');
        } else {
          let errorDetail = 'Formspree submission failed';
          try {
            const data = await response.json();
            if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
              errorDetail = data.errors.map(err => err.message || err.field).join(', ');
            } else if (data && data.error) {
              errorDetail = data.error;
            }
          } catch (_) {
            errorDetail = `Server returned status ${response.status}`;
          }
          throw new Error(errorDetail);
        }
      } catch (err) {
        console.error('Formspree Research Idea Delivery Error:', err);
        ideaFeedback.className = 'form-feedback feedback-error';
        ideaFeedback.innerHTML = `
          <strong>Submission Service Error:</strong><br>
          Unable to deliver proposal via Formspree (${escapeHTML(err.message || 'Network error')}).<br>
          Please verify your Formspree endpoint in <code>script.js</code>, or send your proposal directly to <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
        `;
        ideaFeedback.removeAttribute('hidden');
        showToast('Submission error. Please email binoysarker2003@gmail.com directly.');
      } finally {
        isSubmittingIdea = false;
        setButtonLoading(ideaSubmitBtn, false, 'Submit Research Idea');
      }
    });
  }

  // 10. Contact Form Handler (Formspree Integration)
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  let isSubmittingContact = false;

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmittingContact) return; // Prevent duplicate clicks while in progress

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const subjectError = document.getElementById('subject-error');
      const messageError = document.getElementById('message-error');

      let isValid = true;
      formFeedback.setAttribute('hidden', '');

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

      if (!isValid) return;

      const targetEndpoint = resolveFormspreeEndpoint(
        FORMSPREE_CONFIG.contactFormEndpoint || contactForm.getAttribute('action')
      );

      // Check if Formspree endpoint is configured or placeholder
      if (isFormspreePlaceholder(targetEndpoint)) {
        formFeedback.className = 'form-feedback feedback-info';
        formFeedback.innerHTML = `
          <strong>Message Validated (Formspree Setup Step Required):</strong><br>
          Thank you, <em>${escapeHTML(nameInput.value.trim())}</em>! All form fields have passed validation.<br><br>
          To automatically route messages to <strong>binoysarker2003@gmail.com</strong>, configure your Formspree Form ID in <code>FORMSPREE_CONFIG</code> at the top of <code>script.js</code>:<br>
          • Replace <code>'YOUR_CONTACT_FORMSPREE_ID'</code> with your Formspree ID (e.g. <code>https://formspree.io/f/xpwzqalb</code>).<br><br>
          <span style="color: #A0A0A0; font-size: 0.85rem;">
            Direct inquiries can also be sent directly to <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
          </span>
        `;
        formFeedback.removeAttribute('hidden');
        showToast('Message validated. Enter Formspree ID in script.js to send email.');
        return;
      }

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        _replyto: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        _subject: `[Portfolio Inquiry] ${subjectInput.value.trim()} - from ${nameInput.value.trim()}`,
        submitted_at: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      };

      // Live Formspree Transmission via fetch
      isSubmittingContact = true;
      setButtonLoading(contactSubmitBtn, true, 'Sending message...');
      formFeedback.setAttribute('hidden', '');

      try {
        const response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          formFeedback.className = 'form-feedback feedback-success';
          formFeedback.innerHTML = `
            <strong>Message Sent Successfully:</strong><br>
            Thank you, <em>${escapeHTML(payload.name)}</em>. Your inquiry regarding "<strong>${escapeHTML(payload.subject)}</strong>" has been delivered directly to Binoy Sarker (<code>binoysarker2003@gmail.com</code>). You will receive a response shortly.
          `;
          formFeedback.removeAttribute('hidden');
          contactForm.reset();
          showToast('Message delivered to binoysarker2003@gmail.com.');
        } else {
          let errorDetail = 'Formspree submission failed';
          try {
            const data = await response.json();
            if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
              errorDetail = data.errors.map(err => err.message || err.field).join(', ');
            } else if (data && data.error) {
              errorDetail = data.error;
            }
          } catch (_) {
            errorDetail = `Server returned status ${response.status}`;
          }
          throw new Error(errorDetail);
        }
      } catch (err) {
        console.error('Formspree Contact Form Delivery Error:', err);
        formFeedback.className = 'form-feedback feedback-error';
        formFeedback.innerHTML = `
          <strong>Message Delivery Error:</strong><br>
          Unable to deliver message via Formspree (${escapeHTML(err.message || 'Network error')}).<br>
          Please verify your Formspree endpoint in <code>script.js</code>, or email directly at <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
        `;
        formFeedback.removeAttribute('hidden');
        showToast('Delivery error. Please email binoysarker2003@gmail.com directly.');
      } finally {
        isSubmittingContact = false;
        setButtonLoading(contactSubmitBtn, false, 'Submit Message');
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
    const arrow = btn.querySelector('.arrow-icon');
    if (arrow) {
      arrow.style.display = isLoading ? 'none' : 'inline';
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
