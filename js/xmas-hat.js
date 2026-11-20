/* Santa hat on the first letter of titles of `christmas: true` posts:
   the page title on the post itself, and the post's title in lists (home, Off Duty, tags).
   Shown 1 Nov – 6 Jan (Europe/Athens), like the countdown, and never after a page's christmas_until.
   Links come from data-xmas-links as [{u, until}]. */
(function () {
  "use strict";
  var p = {};
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Athens", year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = +x.value; });
  if (!(p.month >= 11 || (p.month === 1 && p.day <= 6))) return;
  var today = p.year + "-" + ("0" + p.month).slice(-2) + "-" + ("0" + p.day).slice(-2);
  function live(until) { return !until || today <= until; }

  function decorate(el) {
    if (!el || el.querySelector(".xmas-hat")) return;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), node;
    while ((node = walker.nextNode()) && !node.nodeValue.trim()) {}
    if (!node) return;
    var text = node.nodeValue, i = text.search(/\S/);
    var span = document.createElement("span");
    span.className = "xmas-hat";
    span.textContent = text.charAt(i);
    var rest = document.createTextNode(text.slice(i + 1));
    node.nodeValue = text.slice(0, i);
    node.parentNode.insertBefore(span, node.nextSibling);
    span.parentNode.insertBefore(rest, span.nextSibling);
  }

  function run() {
    var tag = document.querySelector("script[data-xmas-links]");
    if (tag && tag.getAttribute("data-xmas-self") === "1" && live(tag.getAttribute("data-xmas-until"))) {
      decorate(document.querySelector("article h1, main h1, h1"));
    }
    var links = [];
    try { links = JSON.parse(tag ? tag.getAttribute("data-xmas-links") : "[]"); } catch (e) {}
    links.forEach(function (l) {
      var href = typeof l === "string" ? l : l.u;
      if (typeof l !== "string" && !live(l.until)) return;
      document.querySelectorAll('a[href="' + href + '"] h2, a[href="' + href + '"] h3').forEach(decorate);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
