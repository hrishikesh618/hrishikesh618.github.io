document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // Nav dropdowns open only on click (not hover), and close when the
  // pointer leaves the dropdown, on a repeat click, on outside click,
  // on Escape, or by navigating to another page.
  var dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  Array.prototype.forEach.call(dropdownToggles, function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.parentElement;
      var isOpen = parent.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Closing on mouseleave uses a short delay (cancelled if the pointer
    // re-enters) so crossing the small gap between the button and the
    // menu below it doesn't close the dropdown before a click lands.
    var li = btn.parentElement;
    var closeTimer = null;
    li.addEventListener("mouseleave", function () {
      closeTimer = setTimeout(function () {
        li.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }, 250);
    });
    li.addEventListener("mouseenter", function () {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });
  });

  // Clicking anywhere outside an open dropdown closes it.
  document.addEventListener("click", function (e) {
    var open = document.querySelectorAll("li.has-dropdown.open");
    Array.prototype.forEach.call(open, function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove("open");
        var t = li.querySelector(".dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Escape closes any open dropdown.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = document.querySelectorAll("li.has-dropdown.open");
    Array.prototype.forEach.call(open, function (li) {
      li.classList.remove("open");
      var t = li.querySelector(".dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });
});
