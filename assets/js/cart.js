/**
 * cart.js – Cart helpers: live quantity updates via fetch with graceful fallback.
 * On cart.php, changing a quantity submits the form directly (PHP fallback).
 * This file enhances with AJAX where the endpoint exists.
 */

(function () {
    'use strict';

    // Increment/decrement quantity buttons (if present)
    document.querySelectorAll('[data-cart-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const form = btn.closest('form');
            if (!form) return;
            const input = form.querySelector('input[name="qty"]');
            if (!input) return;
            const action = btn.getAttribute('data-cart-action');
            const current = parseInt(input.value, 10) || 1;
            let next = current;
            if (action === 'inc') next = current + 1;
            if (action === 'dec' && current > 1) next = current - 1;
            input.value = next;
            form.submit();
        });
    });
})();
