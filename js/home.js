/* Home page behaviour: the rotating hero headline, the featured research
   deck, and the photo carousel. Each initialiser exits quietly when its
   markup is not on the page, so this file is safe to load anywhere.

   Every animation here honours prefers-reduced-motion: the content still
   changes, it simply appears instead of typing or auto-advancing. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------------------------------------------------------------- *
   * Rotating hero headline
   * ---------------------------------------------------------------- */

  function initKineticHeadline() {
    var line = document.getElementById("heroRotate");
    if (!line) return;

    var phrases;
    try {
      phrases = JSON.parse(line.getAttribute("data-phrases") || "[]");
    } catch (error) {
      phrases = [];
    }
    if (!phrases.length) return;

    // Without motion, show the first phrase and leave it alone.
    if (reduceMotion) {
      line.textContent = phrases[0];
      return;
    }

    var TYPE_MS = 52;
    var ERASE_MS = 26;
    var HOLD_MS = 2100;

    var index = 0;
    var text = document.createTextNode("");
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = " ";

    line.textContent = "";
    line.appendChild(text);
    line.appendChild(cursor);

    function type(phrase, position) {
      text.nodeValue = phrase.slice(0, position);
      if (position < phrase.length) {
        setTimeout(function () { type(phrase, position + 1); }, TYPE_MS);
      } else {
        setTimeout(function () { erase(phrase, phrase.length); }, HOLD_MS);
      }
    }

    function erase(phrase, position) {
      text.nodeValue = phrase.slice(0, position);
      if (position > 0) {
        setTimeout(function () { erase(phrase, position - 1); }, ERASE_MS);
      } else {
        index = (index + 1) % phrases.length;
        setTimeout(function () { type(phrases[index], 0); }, 220);
      }
    }

    type(phrases[0], 0);
  }

  /* ---------------------------------------------------------------- *
   * Featured research deck
   * ---------------------------------------------------------------- */

  function initFeaturedDeck() {
    var deck = document.querySelector(".featured-deck");
    if (!deck) return;

    var slides = Array.prototype.slice.call(deck.querySelectorAll(".featured"));
    if (slides.length < 2) return;

    var dotWrap = deck.querySelector(".deck-dots");
    var prev = deck.querySelector(".deck-prev");
    var next = deck.querySelector(".deck-next");
    var current = 0;
    var timer = null;
    var AUTO_MS = 7000;

    var dots = slides.map(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show study " + (i + 1) + ": " + (slide.getAttribute("data-title") || ""));
      dot.addEventListener("click", function () { show(i); restart(); });
      if (dotWrap) dotWrap.appendChild(dot);
      return dot;
    });

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle("is-active", n === current);
      });
      dots.forEach(function (dot, n) {
        if (n === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function step(delta) { show(current + delta); restart(); }

    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1); }, AUTO_MS);
    }

    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    // Pause while the reader is hovering or tabbing through the deck.
    deck.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    deck.addEventListener("mouseleave", restart);
    deck.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
    deck.addEventListener("focusout", restart);

    show(0);
    restart();
  }

  /* ---------------------------------------------------------------- *
   * Photo carousel
   * ---------------------------------------------------------------- */

  function initShots() {
    var shots = document.querySelector(".shots");
    if (!shots) return;

    /* Direct children only: the arrows live inside .shots too. */
    var figures = Array.prototype.slice.call(shots.children).filter(function (node) {
      return node.tagName === "FIGURE";
    });
    if (figures.length < 2) return;

    var dotWrap = document.querySelector(".shot-dots");
    var prev = shots.querySelector(".shot-prev");
    var next = shots.querySelector(".shot-next");
    var current = 0;
    var timer = null;
    var AUTO_MS = 4200;

    var dots = figures.map(function (figure, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show photo " + (i + 1));
      dot.addEventListener("click", function () { show(i); restart(); });
      if (dotWrap) dotWrap.appendChild(dot);
      return dot;
    });

    function show(i) {
      current = (i + figures.length) % figures.length;
      figures.forEach(function (figure, n) {
        figure.classList.toggle("is-active", n === current);
      });
      dots.forEach(function (dot, n) {
        if (n === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1); }, AUTO_MS);
    }

    function step(delta) { show(current + delta); restart(); }

    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    shots.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    shots.addEventListener("mouseleave", restart);
    shots.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
    shots.addEventListener("focusout", restart);

    show(0);
    restart();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initKineticHeadline();
    initFeaturedDeck();
    initShots();
  });
})();
