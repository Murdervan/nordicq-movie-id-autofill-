// ==UserScript==
// @name         NordicQ Movie ID Auto-Fill
// @author Murdervan
// @namespace    https://github.com/murdervan
// @version      1.0.1
// @description  Auto-fill TMDB & IMDB IDs on NordicQ request form + quick link to Movie ID Finder
// @match        https://nordicq.org/requests/create
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
     Helpers
  ========================== */

  const $ = sel => document.querySelector(sel);

  function trigger(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function flash(el) {
    el.style.outline = '2px solid #2ecc71';
    setTimeout(() => el.style.outline = '', 800);
  }

  /* =========================
     Field detection (robust)
  ========================== */

  function getFields() {
    return {
      tmdb: $('input[name="tmdb"], #tmdb, input[placeholder*="TMDB"]'),
      imdb: $('input[name="imdb"], #imdb, input[placeholder*="IMDB"]'),
      mal:  $('input[name="mal"],  #mal,  input[placeholder*="MAL"]'),
      title:$('input[name="title"], #title, input[placeholder*="Titel"]')
    };
  }

  /* =========================
     Auto-paste logic
  ========================== */

  document.addEventListener('paste', e => {
    const text = (e.clipboardData || window.clipboardData)
      .getData('text')
      .trim();

    const { tmdb, imdb } = getFields();

    // TMDB ID (kun tal)
    if (/^\d+$/.test(text) && tmdb) {
      tmdb.value = text;
      trigger(tmdb);
      flash(tmdb);
    }

    // IMDB ID (tt1234567 eller 1234567)
    if (/^(tt)?\d{7,}$/.test(text) && imdb) {
      imdb.value = text.replace(/^tt/, '');
      trigger(imdb);
      flash(imdb);
    }
  });

  /* =========================
     Inject Movie ID Finder button
  ========================== */

  function injectButton() {
    if ($('#movie-id-finder-btn')) return;

    const form = $('form');
    if (!form) return;

    const btn = document.createElement('button');
    btn.id = 'movie-id-finder-btn';
    btn.type = 'button';
    btn.textContent = '🎬 Find Movie ID';
    btn.style.cssText = `
      margin-bottom: 12px;
      padding: 8px 14px;
      border-radius: 8px;
      background: linear-gradient(90deg,#1da1f2,#f1c40f);
      color: #000;
      font-weight: bold;
      cursor: pointer;
      border: none;
    `;

    btn.onclick = () => {
      window.open(
        'https://murdervan.github.io/movie-id-finder/',
        '_blank'
      );
    };

    form.prepend(btn);
  }

  /* =========================
     Init (wait for UNIT3D/Vue)
  ========================== */

  const wait = setInterval(() => {
    if ($('input')) {
      injectButton();
      clearInterval(wait);
    }
  }, 500);

})();
