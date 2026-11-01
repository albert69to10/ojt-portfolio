// Highlights the nav link for the section currently on screen.
document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".site-header nav a");
  var sections = Array.prototype.map.call(links, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  function update() {
    var y = window.scrollY + 120;
    links.forEach(function (link, i) {
      var s = sections[i];
      var active = s && s.offsetTop <= y && s.offsetTop + s.offsetHeight > y;
      link.style.color = active ? "var(--accent)" : "";
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
});
