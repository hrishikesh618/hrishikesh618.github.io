document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector("img");
  var lightboxCaption = lightbox.querySelector(".lightbox-caption");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");

  var currentGroup = [];
  var currentIndex = -1;

  function show(index) {
    var btn = currentGroup[index];
    if (!btn) return;
    currentIndex = index;
    var img = btn.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = btn.getAttribute("data-caption") || img.alt || "";
    lightboxCaption.textContent = btn.getAttribute("data-caption") || img.alt || "";
    var multiple = currentGroup.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
  }

  function open(group, index) {
    currentGroup = group;
    show(index);
    lightbox.classList.add("open");
  }

  function close() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
    currentGroup = [];
    currentIndex = -1;
  }

  function prev() {
    if (!currentGroup.length) return;
    show((currentIndex - 1 + currentGroup.length) % currentGroup.length);
  }

  function next() {
    if (!currentGroup.length) return;
    show((currentIndex + 1) % currentGroup.length);
  }

  document.querySelectorAll(".gallery-grid").forEach(function (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-item"));
    items.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        open(items, i);
      });
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  });
});
