/* Hello to whoever opens the developer tools. */
(function () {
  try {
    var big = "font: 700 22px/1.2 system-ui, sans-serif; color: #fff; background: #0f172a; padding: 6px 12px; border-radius: 8px;";
    var txt = "font: 14px/1.6 system-ui, sans-serif;";
    console.log("%cCK", big);
    console.log(
      "%c👋 Poking around? Good instinct.\n" +
      "Found something? Report it responsibly: security@christoskalyvas.eu\n" +
      "Policy: https://christoskalyvas.eu/.well-known/security.txt",
      txt
    );
  } catch (e) {}
})();
