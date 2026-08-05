document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // Nav dropdowns. Desktop also opens on hover via CSS; this click handler is
  // what makes them usable on touch screens and via the keyboard.
  var dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  Array.prototype.forEach.call(dropdownToggles, function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.parentElement;
      var isOpen = parent.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
