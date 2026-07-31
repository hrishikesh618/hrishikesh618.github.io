document.addEventListener("DOMContentLoaded", function () {
  var list = document.querySelector(".pub-timeline");
  var sortSelect = document.querySelector("#pub-sort");
  var dirBtn = document.querySelector("#pub-sort-dir");
  if (!list || !sortSelect || !dirBtn) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".pub-timeline-item"));
  var direction = "desc"; // desc = newest/highest first

  function updateDirLabel() {
    dirBtn.textContent = direction === "desc" ? "↓ High to low" : "↑ Low to high";
  }

  function sortItems() {
    var key = sortSelect.value; // "year" | "if" | "citations"
    var sorted = items.slice().sort(function (a, b) {
      var av = parseFloat(a.dataset[key]) || 0;
      var bv = parseFloat(b.dataset[key]) || 0;
      return direction === "desc" ? bv - av : av - bv;
    });
    sorted.forEach(function (el) { list.appendChild(el); });
  }

  sortSelect.addEventListener("change", sortItems);
  dirBtn.addEventListener("click", function () {
    direction = direction === "desc" ? "asc" : "desc";
    updateDirLabel();
    sortItems();
  });

  updateDirLabel();
  sortItems();
});
