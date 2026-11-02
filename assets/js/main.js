/**
 * main.js – Shared frontend behaviour for The Artisan's Room.
 *
 * - Mobile hamburger menu
 * - Scroll reveal animation
 * - Flash auto-dismiss
 * - Back to top button
 * - Cart quantity live update via fetch (with fallback)
 */

(function () {
    'use strict';

    // Mobile menu toggle
    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open === true ? 'true' : 'false');
        });
        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Scroll reveal
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 120;
        reveals.forEach(function (el) {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', reveal);
    window.addEventListener('load', reveal);

    // Auto-dismiss flash messages after 6 seconds
    setTimeout(function () {
        const container = document.getElementById('flashContainer');
        if (container) {
            container.style.opacity = '0';
            setTimeout(function () { container.remove(); }, 400);
        }
    }, 6000);

    // Back to top
    const topBtn = document.getElementById('backToTop');
    if (topBtn) {
        window.addEventListener('scroll', function () {
            topBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Image lazy loading fallback placeholder
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        img.addEventListener('error', function () {
            this.src = 'assets/images/placeholder.svg';
        });
    });
})();
