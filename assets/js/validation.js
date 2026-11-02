/**
 * validation.js – Client-side form validation helpers.
 * Used on sign-up, sign-in, checkout and contact forms.
 */

(function () {
    'use strict';

    function showError(input, message) {
        const group = input.closest('.form__group');
        if (!group) return;
        // Remove existing error
        const old = group.querySelector('.error-text');
        if (old) old.remove();
        const err = document.createElement('div');
        err.className = 'error-text';
        err.style.color = '#b32323';
        err.style.fontSize = '0.8rem';
        err.style.marginTop = '0.3rem';
        err.textContent = message;
        group.appendChild(err);
        input.classList.add('input-error');
    }

    function clearError(input) {
        const group = input.closest('.form__group');
        if (!group) return;
        const old = group.querySelector('.error-text');
        if (old) old.remove();
        input.classList.remove('input-error');
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // Sign-up validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            let ok = true;
            const name = signupForm.elements['name'];
            const email = signupForm.elements['email'];
            const password = signupForm.elements['password'];
            const confirm = signupForm.elements['confirm_password'];

            [name, email, password, confirm].forEach(clearError);

            if (!name.value.trim()) { showError(name, 'Name is required.'); ok = false; }
            if (!email.value.trim()) { showError(email, 'Email is required.'); ok = false; }
            else if (!isEmail(email.value)) { showError(email, 'Enter a valid email.'); ok = false; }
            if (!password.value) { showError(password, 'Password is required.'); ok = false; }
            else if (password.value.length < 8) { showError(password, 'Password must be at least 8 characters.'); ok = false; }
            if (!confirm.value) { showError(confirm, 'Confirm your password.'); ok = false; }
            else if (password.value !== confirm.value) { showError(confirm, 'Passwords do not match.'); ok = false; }

            if (!ok) e.preventDefault();
        });
    }

    // Generic required-field validation for any form with data-validate="required"
    document.querySelectorAll('form[data-validate="required"]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            let ok = true;
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (input) {
                clearError(input);
                if (!input.value.trim()) {
                    showError(input, 'This field is required.');
                    ok = false;
                }
            });
            if (!ok) e.preventDefault();
        });
    });
})();
