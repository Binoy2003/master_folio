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
  const cleanId = trimmed.replace(/^f\//, '');
  return `https://formspree.io/f/${cleanId}`;
}

// Helper to verify whether real credentials have replaced placeholder values
function isFormspreePlaceholder(val) {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return (
    trimmed === '' ||
    trimmed.includes('YOUR_') ||
    trimmed.includes('YOUR_CONTACT_FORMSPREE_ID') ||
    trimmed.includes('YOUR_RESEARCH_FORMSPREE_ID') ||
    trimmed === 'https://formspree.io/f/'
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

  // 4b. Back to Top Smooth Scrolling Handler
  const backToTopLinks = document.querySelectorAll('.back-to-top, a[href="#top"]');
  backToTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, null, '#top');
      }
    });
  });

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

    // Real-time input listeners to clear errors as user corrects them
    const clearError = (input, errorSpan) => {
      if (input) input.classList.remove('has-error');
      if (errorSpan) errorSpan.setAttribute('hidden', '');
    };

    if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    if (emailInput) emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    if (titleInput) titleInput.addEventListener('input', () => clearError(titleInput, titleError));
    if (areaSelect) areaSelect.addEventListener('change', () => clearError(areaSelect, areaError));
    if (descInput) descInput.addEventListener('input', () => clearError(descInput, descError));
    if (linkInput) linkInput.addEventListener('input', () => clearError(linkInput, linkError));

    ideaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmittingIdea) return; // Prevent duplicate submissions while in progress

      let isValid = true;
      let firstInvalidInput = null;
      if (ideaFeedback) ideaFeedback.setAttribute('hidden', '');

      // Name validation
      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.classList.add('has-error');
        if (nameError) nameError.removeAttribute('hidden');
        if (!firstInvalidInput) firstInvalidInput = nameInput;
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !emailPattern.test(emailVal)) {
        if (emailInput) emailInput.classList.add('has-error');
        if (emailError) emailError.removeAttribute('hidden');
        if (!firstInvalidInput) firstInvalidInput = emailInput;
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Title validation
      if (!titleInput || !titleInput.value.trim()) {
        if (titleInput) titleInput.classList.add('has-error');
        if (titleError) titleError.removeAttribute('hidden');
        if (!firstInvalidInput) firstInvalidInput = titleInput;
        isValid = false;
      } else {
        clearError(titleInput, titleError);
      }

      // Area validation
      if (!areaSelect || !areaSelect.value) {
        if (areaSelect) areaSelect.classList.add('has-error');
        if (areaError) areaError.removeAttribute('hidden');
        if (!firstInvalidInput) firstInvalidInput = areaSelect;
        isValid = false;
      } else {
        clearError(areaSelect, areaError);
      }

      // Description validation
      if (!descInput || !descInput.value.trim()) {
        if (descInput) descInput.classList.add('has-error');
        if (descError) descError.removeAttribute('hidden');
        if (!firstInvalidInput) firstInvalidInput = descInput;
        isValid = false;
      } else {
        clearError(descInput, descError);
      }

      // Optional Link validation (if provided)
      const linkVal = linkInput ? linkInput.value.trim() : '';
      if (linkVal) {
        try {
          const urlObj = new URL(linkVal);
          if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            throw new Error('Invalid protocol');
          }
          clearError(linkInput, linkError);
        } catch (_) {
          if (linkInput) linkInput.classList.add('has-error');
          if (linkError) linkError.removeAttribute('hidden');
          if (!firstInvalidInput) firstInvalidInput = linkInput;
          isValid = false;
        }
      } else {
        clearError(linkInput, linkError);
      }

      if (!isValid) {
        if (firstInvalidInput && typeof firstInvalidInput.focus === 'function') {
          firstInvalidInput.focus();
        }
        showToast('Please fill in all required fields marked with *');
        return;
      }

      // Spam Bot Protection via honeypot
      const honeypot = ideaForm.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value.trim() !== '') {
        // Silently drop bot submission
        if (ideaFeedback) {
          ideaFeedback.className = 'form-feedback feedback-success';
          ideaFeedback.innerHTML = `<strong>Thank you!</strong> Your submission has been received.`;
          ideaFeedback.removeAttribute('hidden');
        }
        ideaForm.reset();
        return;
      }

      const targetEndpoint = resolveFormspreeEndpoint(
        FORMSPREE_CONFIG.researchFormEndpoint || ideaForm.getAttribute('action')
      );

      // Check if Formspree endpoint is configured or placeholder
      if (isFormspreePlaceholder(targetEndpoint)) {
        if (ideaFeedback) {
          ideaFeedback.className = 'form-feedback feedback-info';
          ideaFeedback.innerHTML = `
            <strong>Formspree Endpoint Configuration Required:</strong><br>
            All client-side validation checks passed for <em>${escapeHTML(nameInput.value.trim())}</em>'s research idea "<strong>${escapeHTML(titleInput.value.trim())}</strong>".<br><br>
            To route live email notifications directly to <strong>binoysarker2003@gmail.com</strong>, configure your Formspree Form ID in <code>FORMSPREE_CONFIG</code> in <code>script.js</code>:<br>
            • Sign up / login at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:underline;">formspree.io</a> with <code>binoysarker2003@gmail.com</code>.<br>
            • Click <strong>+ New Form</strong> and set the notification target to <code>binoysarker2003@gmail.com</code>.<br>
            • Copy your Form ID (e.g. <code>mqkbrzen</code>) and update <code>researchFormEndpoint</code> at line 23 in <code>script.js</code>.<br><br>
            <span style="color: #A0A0A0; font-size: 0.85rem;">
              You can also send your proposal directly via email to <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
            </span>
          `;
          ideaFeedback.removeAttribute('hidden');
          ideaFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('Form validated. Configure Formspree ID in script.js to send email.');
        return;
      }

      // Construct comprehensive payload mapping all fields cleanly for Formspree
      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        _replyto: emailInput.value.trim(),
        _subject: `[Research Idea] ${titleInput.value.trim()} [${areaSelect.value}] — ${nameInput.value.trim()}`,
        "Submitter Name": nameInput.value.trim(),
        "Submitter Email": emailInput.value.trim(),
        "Research Idea Title": titleInput.value.trim(),
        "Research Area": areaSelect.value,
        "Project Stage": (stageSelect && stageSelect.value) ? stageSelect.value : 'Not specified',
        "Research Description": descInput.value.trim(),
        "Reference Link": linkVal || 'None provided',
        "Submission Timestamp": new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      };

      // Live Formspree Transmission via fetch
      isSubmittingIdea = true;
      setButtonLoading(ideaSubmitBtn, true, 'Submitting Idea...');
      if (ideaFeedback) ideaFeedback.setAttribute('hidden', '');

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
          if (ideaFeedback) {
            ideaFeedback.className = 'form-feedback feedback-success';
            ideaFeedback.innerHTML = `
              <strong>Research Idea Submitted Successfully!</strong><br>
              Thank you, <em>${escapeHTML(payload.name)}</em>! Your research idea "<strong>${escapeHTML(payload["Research Idea Title"])}</strong>" in the domain <em>${escapeHTML(payload["Research Area"])}</em> has been forwarded directly to <code>binoysarker2003@gmail.com</code>.<br>
              We appreciate your initiative and look forward to reviewing your proposal.
            `;
            ideaFeedback.removeAttribute('hidden');
            ideaFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          ideaForm.reset();
          [nameInput, emailInput, titleInput, areaSelect, descInput, linkInput].forEach(el => {
            if (el) el.classList.remove('has-error');
          });
          showToast('Research idea transmitted to binoysarker2003@gmail.com');
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
        console.error('Research Idea Submission Error:', err);
        if (ideaFeedback) {
          ideaFeedback.className = 'form-feedback feedback-error';
          ideaFeedback.innerHTML = `
            <strong>Submission Delivery Error:</strong><br>
            Unable to deliver proposal to <code>binoysarker2003@gmail.com</code> (${escapeHTML(err.message || 'Network error')}).<br>
            Your entered details have been preserved so you can retry, or you can email directly to <a href="mailto:binoysarker2003@gmail.com" class="email-clickable">binoysarker2003@gmail.com</a>.
          `;
          ideaFeedback.removeAttribute('hidden');
          ideaFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('Submission error. Your information has been preserved.');
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

  // 10b. Collapsible Web Form Toggle Handler
  const toggleContactBtn = document.getElementById('toggle-contact-form-btn');
  const expandableForm = document.getElementById('contact-form-expandable');
  if (toggleContactBtn && expandableForm) {
    toggleContactBtn.addEventListener('click', () => {
      const isHidden = expandableForm.hasAttribute('hidden');
      const label = toggleContactBtn.querySelector('#toggle-btn-label');
      const chevron = toggleContactBtn.querySelector('.toggle-chevron');

      if (isHidden) {
        expandableForm.removeAttribute('hidden');
        toggleContactBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Hide web message form';
        if (chevron) chevron.textContent = '↑';
      } else {
        expandableForm.setAttribute('hidden', '');
        toggleContactBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Or send a message via web form';
        if (chevron) chevron.textContent = '↓';
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
