/**
 * form.js
 * Form validation and submission for contact & supporter forms.
 */

'use strict';

/* ---- Validation Rules ---- */
const RULES = {
  required: (val) => val.trim() !== '' || 'This field is required.',
  email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email address.',
  phone:    (val) => /^(\+?880|0)1[3-9]\d{8}$/.test(val.replace(/\s/g, '')) || 'Enter a valid Bangladeshi phone number.',
  minLen:   (min) => (val) => val.trim().length >= min || `Minimum ${min} characters required.`,
};

function validateField(input) {
  const rules  = (input.dataset.validate || '').split(',').filter(Boolean);
  const value  = input.value;
  const errEl  = document.getElementById(`${input.id}-error`);

  for (const rule of rules) {
    const [name, arg] = rule.trim().split(':');
    const fn = name === 'minLen' ? RULES.minLen(parseInt(arg)) : RULES[name];
    if (!fn) continue;
    const result = fn(value);
    if (result !== true) {
      input.classList.add('error');
      if (errEl) { errEl.textContent = result; errEl.classList.add('show'); }
      return false;
    }
  }

  input.classList.remove('error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  return true;
}

function validateForm(form) {
  const fields  = form.querySelectorAll('[data-validate]');
  let allValid  = true;
  fields.forEach(f => { if (!validateField(f)) allValid = false; });
  return allValid;
}

/* ---- Supporter / Join Form ---- */
async function initSupporterForm() {
  const form = document.getElementById('supporter-form');
  if (!form) return;

  // Live validation on blur
  form.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> Submitting…';

    const formData = {
      name:         form.querySelector('#s-name')?.value.trim(),
      phone:        form.querySelector('#s-phone')?.value.trim(),
      email:        form.querySelector('#s-email')?.value.trim(),
      institution:  form.querySelector('#s-institution')?.value.trim(),
      district:     form.querySelector('#s-district')?.value,
      message:      form.querySelector('#s-message')?.value.trim(),
    };

    try {
      await API.submitSupporterForm(formData);
      showToast('Your application has been submitted successfully!', 'success');
      form.reset();
    } catch (err) {
      showToast('Submission failed. Please try again.', 'error');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ---- Contact Form ---- */
async function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    const formData = {
      name:    form.querySelector('#c-name')?.value.trim(),
      email:   form.querySelector('#c-email')?.value.trim(),
      subject: form.querySelector('#c-subject')?.value.trim(),
      message: form.querySelector('#c-message')?.value.trim(),
    };

    try {
      await API.submitContactForm(formData);
      showToast('Message sent! We will get back to you soon.', 'success');
      form.reset();
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSupporterForm();
  initContactForm();
});
