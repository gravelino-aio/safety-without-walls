document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('trusted-slider-track');
  const prevBtn = document.getElementById('trusted-nav-prev');
  const nextBtn = document.getElementById('trusted-nav-next');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  let currentIndex = 0;
  const cards = track.querySelectorAll('.trusted-card');
  const maxIndex = cards.length > 0 ? cards.length - 1 : 0;
  
  function getSlideDistance() {
    const width = window.innerWidth;
    if (width >= 1025) {
      // Desktop card width (872) + gap (24) = 896px
      return 896;
    } else if (width >= 768) {
      // Tablet card width (648) + gap (24) = 672px
      return 672;
    } else {
      // Mobile card width (326) + gap (24) = 350px
      return 350;
    }
  }
  
  function updateSlider() {
    const distance = getSlideDistance();
    track.style.transform = `translateX(-${currentIndex * distance}px)`;
    
    // Update button states
    if (currentIndex === 0) {
      prevBtn.setAttribute('disabled', 'true');
    } else {
      prevBtn.removeAttribute('disabled');
    }
    
    if (currentIndex === maxIndex) {
      nextBtn.setAttribute('disabled', 'true');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });
  
  window.addEventListener('resize', () => {
    updateSlider();
    // Recalculate active FAQ accordion height on resize
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const wrapper = item.querySelector('.faq-answer-wrapper');
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      }
    });
  });

  // FAQ Accordion Toggle Logic
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const wrapper = item.querySelector('.faq-answer-wrapper');
    
    // Set initial active state height if it is active by default
    if (item.classList.contains('active')) {
      // Small timeout to ensure scrollHeight is fully calculated by DOM
      setTimeout(() => {
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      }, 50);
    }
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Collapses other accordion items (accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherWrapper = otherItem.querySelector('.faq-answer-wrapper');
          otherWrapper.style.maxHeight = '0px';
          otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggles current accordion item
      if (isActive) {
        item.classList.remove('active');
        wrapper.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================================================
  // MULTI-STEP FORM WIZARD LOGIC
  // ==========================================================================
  const form = document.getElementById('multistep-form');
  const panels = document.querySelectorAll('.form-step-panel');
  const stepDots = document.querySelectorAll('.form-progress-step');
  const lineFill = document.getElementById('progress-line-fill');
  
  let currentStep = 1;

  // Custom Dropdowns Toggle & Selection
  const dropdownWrappers = document.querySelectorAll('.custom-select-wrapper');
  
  dropdownWrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const triggerText = wrapper.querySelector('.custom-select-trigger-text');
    const optionsContainer = wrapper.querySelector('.custom-select-options');
    const options = wrapper.querySelectorAll('.custom-select-option');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    
    // Toggle dropdown visibility
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other open dropdowns first
      dropdownWrappers.forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      if (countryWrapper) countryWrapper.classList.remove('open');
      
      // Show/hide options menu
      const isOpen = wrapper.classList.contains('open');
      if (isOpen) {
        wrapper.classList.remove('open');
        optionsContainer.style.display = 'none';
      } else {
        wrapper.classList.add('open');
        optionsContainer.style.display = 'block';
      }
    });
    
    // Handle Option Selection
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const val = option.getAttribute('data-value');
        
        // Remove selected class from sibling options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to chosen option
        option.classList.add('selected');
        
        // Update input and trigger text
        hiddenInput.value = val;
        triggerText.textContent = val;
        
        wrapper.classList.add('has-value');
        wrapper.classList.remove('open');
        optionsContainer.style.display = 'none';
        
        // Clear error if field group had one
        const fieldGroup = wrapper.closest('.field-group');
        if (fieldGroup) fieldGroup.classList.remove('error');
      });
    });
  });

  // Country Selector Toggle & Selection (Step 1)
  const countryWrapper = document.getElementById('country-select-wrapper');
  if (countryWrapper) {
    const countryTrigger = countryWrapper.querySelector('.country-trigger');
    const countryTriggerText = countryWrapper.querySelector('.country-trigger-text');
    const countryOptionsContainer = countryWrapper.querySelector('.country-options');
    const countryOptions = countryWrapper.querySelectorAll('.country-option');
    const countryHiddenInput = countryWrapper.querySelector('input[type="hidden"]');
    
    countryTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownWrappers.forEach(w => {
        w.classList.remove('open');
        w.querySelector('.custom-select-options').style.display = 'none';
      });
      
      const isOpen = countryWrapper.classList.contains('open');
      if (isOpen) {
        countryWrapper.classList.remove('open');
        countryOptionsContainer.style.display = 'none';
      } else {
        countryWrapper.classList.add('open');
        countryOptionsContainer.style.display = 'block';
      }
    });
    
    countryOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = opt.getAttribute('data-code');
        const country = opt.getAttribute('data-country');
        
        countryOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        
        countryTriggerText.textContent = country;
        countryHiddenInput.value = code;
        countryWrapper.classList.remove('open');
        countryOptionsContainer.style.display = 'none';
        
        // Set phone placeholder prefix
        const phoneInput = document.getElementById('input-phone');
        if (phoneInput) {
          phoneInput.placeholder = `${code} (555) 000-0000`;
        }
      });
    });
  }

  // Close all open selectors when clicking outside
  document.addEventListener('click', () => {
    dropdownWrappers.forEach(w => {
      w.classList.remove('open');
      w.querySelector('.custom-select-options').style.display = 'none';
    });
    if (countryWrapper) {
      countryWrapper.classList.remove('open');
      countryWrapper.querySelector('.country-options').style.display = 'none';
    }
  });

  // Checkbox Card Toggles (Step 3)
  const checkboxCards = document.querySelectorAll('.priority-checkbox-card');
  checkboxCards.forEach(card => {
    const checkbox = card.querySelector('.priority-checkbox-hidden');
    
    card.addEventListener('click', (e) => {
      // Toggle card checked style state
      setTimeout(() => {
        if (checkbox.checked) {
          card.classList.add('checked');
        } else {
          card.classList.remove('checked');
        }
      }, 30);
    });
  });

  // Validation Logic Functions
  function validateStep1() {
    let isValid = true;
    
    const firstname = document.getElementById('input-firstname');
    const lastname = document.getElementById('input-lastname');
    const title = document.getElementById('input-title');
    const org = document.getElementById('input-organization');
    const email = document.getElementById('input-email');
    
    // Helper to toggle error class
    const checkRequired = (input) => {
      const group = input.closest('.field-group');
      if (!input.value.trim()) {
        group.classList.add('error');
        isValid = false;
      } else {
        group.classList.remove('error');
      }
    };
    
    checkRequired(firstname);
    checkRequired(lastname);
    checkRequired(title);
    checkRequired(org);
    
    // Email regex validation
    if (email) {
      const emailGroup = email.closest('.field-group');
      const emailVal = email.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailVal) {
        emailGroup.classList.add('error');
        emailGroup.querySelector('.error-msg').textContent = "This field is required.";
        isValid = false;
      } else if (!emailPattern.test(emailVal)) {
        emailGroup.classList.add('error');
        emailGroup.querySelector('.error-msg').textContent = "Please enter a valid email address.";
        isValid = false;
      } else {
        emailGroup.classList.remove('error');
      }
    }
    
    return isValid;
  }

  function validateStep2() {
    let isValid = true;
    
    const roleInput = document.getElementById('input-role');
    const careInput = document.getElementById('input-care-setting');
    const communitiesInput = document.getElementById('input-communities');
    
    const checkSelect = (input) => {
      const group = input.closest('.field-group');
      if (!input.value) {
        group.classList.add('error');
        isValid = false;
      } else {
        group.classList.remove('error');
      }
    };
    
    checkSelect(roleInput);
    checkSelect(careInput);
    checkSelect(communitiesInput);
    
    return isValid;
  }

  // Go to step wizard transitions
  function goToStep(step) {
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(`step-panel-${step}`).classList.add('active');
    
    currentStep = step;
    
    // Update progress tracker fill line
    if (step === 1) {
      lineFill.style.width = '0%';
    } else if (step === 2) {
      lineFill.style.width = '50%';
    } else if (step === 3) {
      lineFill.style.width = '100%';
    }
    
    // Update progress steps dots
    stepDots.forEach((dot, idx) => {
      const stepNum = idx + 1;
      if (stepNum < step) {
        dot.classList.add('completed');
        dot.classList.remove('active');
      } else if (stepNum === step) {
        dot.classList.add('active');
        dot.classList.remove('completed');
      } else {
        dot.classList.remove('active');
        dot.classList.remove('completed');
      }
    });
    
    // Scroll smoothly to form section top so user has context on new page
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Attach Navigation Listeners
  // Step 1 -> Step 2
  const btnStep1Continue = document.getElementById('btn-step1-continue');
  if (btnStep1Continue) {
    btnStep1Continue.addEventListener('click', () => {
      if (validateStep1()) {
        goToStep(2);
      }
    });
  }

  // Step 2 -> Step 1 (Back)
  const btnStep2Back = document.getElementById('btn-step2-back');
  if (btnStep2Back) {
    btnStep2Back.addEventListener('click', () => {
      goToStep(1);
    });
  }

  // Step 2 -> Step 3 (Continue)
  const btnStep2Continue = document.getElementById('btn-step2-continue');
  if (btnStep2Continue) {
    btnStep2Continue.addEventListener('click', () => {
      if (validateStep2()) {
        goToStep(3);
      }
    });
  }

  // Step 3 -> Step 2 (Back)
  const btnStep3Back = document.getElementById('btn-step3-back');
  if (btnStep3Back) {
    btnStep3Back.addEventListener('click', () => {
      goToStep(2);
    });
  }

  // Form Submission Success Modal
  const successModal = document.getElementById('success-modal');
  const btnSuccessClose = document.getElementById('btn-success-close');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Step 3 is submitting, launch modal overlay
      if (successModal) {
        successModal.classList.add('open');
      }
    });
  }
  
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      if (successModal) {
        successModal.classList.remove('open');
      }
      
      // Reset form fields
      if (form) {
        form.reset();
        
        // Reset progress steps
        goToStep(1);
        
        // Reset dropdown texts
        dropdownWrappers.forEach(w => {
          w.classList.remove('has-value');
          w.querySelector('.custom-select-trigger-text').textContent = 
            w.id === 'select-role-wrapper' ? 'Select your role' : 
            w.id === 'select-care-wrapper' ? 'Select setting' : 'Select range';
          w.querySelector('input[type="hidden"]').value = '';
          w.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
        });
        
        // Reset phone select trigger
        const countryTriggerText = document.getElementById('country-select-wrapper').querySelector('.country-trigger-text');
        countryTriggerText.textContent = "US";
        document.getElementById('input-country-code').value = "+1";
        document.getElementById('input-phone').placeholder = "+1 (555) 000-0000";
        document.getElementById('country-select-wrapper').querySelectorAll('.country-option').forEach(o => {
          o.classList.remove('selected');
          if (o.getAttribute('data-country') === 'US') o.classList.add('selected');
        });
        
        // Reset Priority checkbox cards styling
        checkboxCards.forEach(card => card.classList.remove('checked'));
      }
    });
  }

  // Smooth Scroll to Form Section for all CTA elements
  const ctaElements = document.querySelectorAll('.hero-button, .simplify-badge, .safety-card-link');
  const targetSection = document.getElementById('form-section');
  
  if (targetSection) {
    ctaElements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Testimonials "Read more" / "See less" Expandable Logic
  const readMoreLinks = document.querySelectorAll('.trusted-read-more');
  
  readMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const textBlock = link.closest('.trusted-text-block');
      if (!textBlock) return;
      
      const desc = textBlock.querySelector('.trusted-quote-desc');
      if (!desc) return;
      
      desc.classList.toggle('expanded');
      
      if (desc.classList.contains('expanded')) {
        link.textContent = 'See less';
      } else {
        link.textContent = 'Read more';
      }
    });
  });
});
