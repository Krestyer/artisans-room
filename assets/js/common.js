/**
 * common.js – Shared runtime for the static (Vercel) version.
 *
 * Simulates backend behaviour with localStorage:
 *  - users (signin/signup)
 *  - cart (add/update/remove)
 *  - orders & bookings
 *  - current session
 *
 * Also renders the shared header/footer and handles flash messages.
 */

(function(){
  'use strict';

  const SITE_NAME = 'The Artisan\'s Room';
  const LS = {
    USERS: 'ar_users',
    SESSION: 'ar_session',
    CART: 'ar_cart',
    ORDERS: 'ar_orders',
    BOOKINGS: 'ar_bookings',
    MESSAGES: 'ar_messages',
    FLASH: 'ar_flash',
  };

  /* ---------- storage helpers ---------- */
  function get(key, def){
    try{ return JSON.parse(localStorage.getItem(key)) || def; }catch(e){ return def; }
  }
  function set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  /* ---------- init seed data ---------- */
  function initStore(){
    if(!localStorage.getItem(LS.USERS)) set(LS.USERS, SEED.users);
    if(!localStorage.getItem(LS.CART)) set(LS.CART, []);
    if(!localStorage.getItem(LS.ORDERS)) set(LS.ORDERS, []);
    if(!localStorage.getItem(LS.BOOKINGS)) set(LS.BOOKINGS, []);
    if(!localStorage.getItem(LS.MESSAGES)) set(LS.MESSAGES, []);
  }
  initStore();

  /* ---------- session ---------- */
  function currentUser(){ return get(LS.SESSION, null); }
  function isLoggedIn(){ return !!currentUser(); }
  function isAdmin(){ const u=currentUser(); return !!u && u.role==='admin'; }
  function setSession(u){ set(LS.SESSION, u); }
  function clearSession(){ localStorage.removeItem(LS.SESSION); }

  /* ---------- cart ---------- */
  function getCart(){ return get(LS.CART, []); }
  function setCart(c){ set(LS.CART, c); }
  function cartCount(){
    return getCart().reduce((s,i)=>s+(i.qty||1),0);
  }
  function addToCart(item){
    const c = getCart();
    const idx = c.findIndex(x=>x.type===item.type && x.id===item.id);
    if(idx>=0){ c[idx].qty=(c[idx].qty||1)+1; } else { c.push({...item, qty:1}); }
    setCart(c);
  }
  function setQty(index, qty){
    const c = getCart();
    if(!c[index]) return;
    if(qty<1) c.splice(index,1); else c[index].qty = qty;
    setCart(c);
  }
  function removeAt(index){
    const c = getCart(); c.splice(index,1); setCart(c);
  }
  function cartTotal(){
    return getCart().reduce((s,i)=>s + Number(i.price||0)*(i.qty||1), 0);
  }

  /* ---------- flash ---------- */
  function flash(type, msg){
    const f = get(LS.FLASH, {success:null, error:null});
    f[type] = msg;
    set(LS.FLASH, f);
  }
  function consumeFlash(){
    const f = get(LS.FLASH, {success:null, error:null});
    set(LS.FLASH, {success:null, error:null});
    return f;
  }
  function showFlashes(containerId){
    const f = consumeFlash();
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML='';
    if(f.success){
      el.appendChild(makeFlash('success', f.success));
    }
    if(f.error){
      el.appendChild(makeFlash('error', f.error));
    }
  }
  function makeFlash(type, msg){
    const d = document.createElement('div');
    d.className = 'flash flash--'+type;
    d.role='alert';
    d.innerHTML = '<i class="fas '+(type==='success'?'fa-check-circle':'fa-exclamation-circle')+'"></i>'+escapeHtml(msg)+' <button class="flash__close" onclick="this.parentElement.remove()">&times;</button>';
    return d;
  }

  /* ---------- utils ---------- */
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }
  function truncate(s, n=120){ s=String(s); return s.length<=n ? s : s.slice(0,n)+'…'; }
  function fmtPrice(p){ return '₹'+Number(p||0).toFixed(2); }
  function siteUrl(p){ return (p? p : ''); } // static files are relative
  function imageUrl(img, folder){
    if(img && document.querySelector('img[data-src="'+img+'"]')){}
    return 'assets/images/placeholder.svg';
  }

  /* ---------- header/footer ---------- */
  function renderHeader(container, pageTitle){
    const user = currentUser();
    const cc = cartCount();
    const navLinks = [
      { href:'index.html', label:'Home' },
      { href:'artists.html', label:'Artists' },
      { href:'artworks.html', label:'Artworks' },
      { href:'exhibitions.html', label:'Exhibitions' },
      { href:'tutorials.html', label:'Tutorials' },
      { href:'shop.html', label:'Shop' },
    ];
    if(isAdmin()) navLinks.push({ href:'admin/index.html', label:'Admin' });
    else if(user) navLinks.push({ href:'dashboard.html', label:'Dashboard' });
    navLinks.push({ href:'about.html', label:'About Us' });

    const authHtml = user
      ? '<a href="logout.html" class="btn btn--outline btn--small">Logout</a>'
      : '<a href="signin.html" class="btn btn--outline btn--small">Sign In</a><a href="signup.html" class="btn btn--small">Sign Up</a>';

    container.innerHTML = `
    <header class="site-header" id="siteHeader">
      <div class="header__container">
        <a href="index.html" class="header__logo"><i class="fas fa-palette"></i> <span>${SITE_NAME}</span></a>
        <button class="header__toggle" id="headerToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
        <nav class="header__nav" id="headerNav">
          <ul class="nav__list">${navLinks.map(n=>`<li><a href="${n.href}">${escapeHtml(n.label)}</a></li>`).join('')}</ul>
          <div class="nav__auth">${authHtml}<a href="cart.html" class="btn btn--icon" aria-label="Cart (${cc} items)"><i class="fas fa-shopping-cart"></i><span class="cart-badge">${cc}</span></a></div>
        </nav>
      </div>
    </header>
    <div id="flashContainer" style="position:fixed;top:1rem;right:1rem;z-index:2000;display:flex;flex-direction:column;gap:0.75rem;pointer-events:none;"></div>
    <main class="site-main" id="siteMain">
    `;
    showFlashes('flashContainer');

    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');
    if(toggle && nav){
      toggle.onclick = () => { const o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o?'true':'false'); };
      nav.querySelectorAll('a').forEach(a => a.onclick = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
    }
  }

  function renderFooter(container){
    container.innerHTML = `
    </main>
    <footer class="site-footer">
      <div class="footer__container">
        <div class="footer__grid">
          <div class="footer__about">
            <h3>The Artisan's Room</h3>
            <p>Our gallery showcases exceptional works from talented creators worldwide. Find inspiration and bring home art that speaks to your soul.</p>
            <div class="footer__social">
              <a href="javascript:void(0);" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="javascript:void(0);" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="javascript:void(0);" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            </div>
          </div>
          <div class="footer__links"><h4>Gallery</h4><ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="artworks.html">Artworks</a></li>
            <li><a href="artists.html">Artists</a></li>
            <li><a href="exhibitions.html">Exhibitions</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="about.html">About Us</a></li>
          </ul></div>
          <div class="footer__links"><h4>Support</h4><ul>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms of Service</a></li>
            <li><a href="signin.html">Sign In</a></li>
          </ul></div>
        </div>
        <div class="footer__bottom"><p>&copy; 2026 The Artisan's Room. All rights reserved.</p><p class="footer__credit">Static demo for Vercel – TYBSc CS Project</p></div>
      </div>
    </footer>
    <button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>
    <script src="assets/js/main.js"></script>
    `;
  }

  /* ---------- page shell ---------- */
  window.AR = {
    SITE_NAME, currentUser, isLoggedIn, isAdmin, setSession, clearSession,
    getCart, setCart, addToCart, setQty, removeAt, cartCount, cartTotal,
    get: (k,d)=>get(k,d), set:(k,v)=>set(k,v),
    flash, fmtPrice, truncate, escapeHtml, imageUrl,
    renderHeader, renderFooter,
  };
})();
