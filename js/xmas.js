/* Christmas extras for pages with `christmas: true`:
   - New Year countdown (1 Nov – 31 Dec, Europe/Athens), "Καλή χρονιά!" on 1–6 Jan (to Epiphany), hidden otherwise
     and always after the page's christmas_until (data-xmas-until on this script tag).
   - "Jingle Bells" (J. Pierpont, 1857, public domain) synthesised with Web Audio, no audio file.
     Browsers block sound until the visitor interacts, so it starts on the first tap/click/key/scroll
     unless the visitor muted it before (remembered per browser). */
(function () {
  "use strict";
  var TZ = "Europe/Athens";
  var KEY = "xmas-muted";

  function athensParts(d) {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric" })
      .formatToParts(d).forEach(function (x) { p[x.type] = +x.value; });
    return p;
  }

  // ---------- badge (countdown / greeting) ----------
  var bar = document.createElement("div");
  bar.className = "xmas-bar";
  bar.setAttribute("role", "status");
  var label = document.createElement("span");
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "xmas-sound";
  bar.appendChild(label);
  bar.appendChild(btn);

  function updateLabel() {
    var now = new Date(), a = athensParts(now);
    var until = (document.querySelector('script[data-xmas-until][src*="xmas.js"]') || { getAttribute: function () { return ""; } }).getAttribute("data-xmas-until");
    var today = a.year + "-" + ("0" + a.month).slice(-2) + "-" + ("0" + a.day).slice(-2);
    if (until && today > until) return false;
    if (a.month === 1 && a.day <= 6) {
      label.textContent = "🎉 Καλή χρονιά!";
      return true;
    }
    if (a.month >= 11) {
      // Midnight 1 January in Athens = 22:00 UTC on 31 December (UTC+2 in winter)
      var target = Date.UTC(a.year, 11, 31, 22, 0, 0);
      var days = Math.ceil((target - now.getTime()) / 86400000);
      label.textContent = days <= 1 ? "🎄 Αύριο Πρωτοχρονιά!" : "🎄 " + days + " μέρες ως την Πρωτοχρονιά";
      return true;
    }
    return false;
  }

  // ---------- music ----------
  var muted = false;
  try { muted = localStorage.getItem(KEY) === "1"; } catch (e) {}
  var ctx = null, gain = null, playing = false, timer = null;

  // Chorus: [note, beats]; one beat = a quarter note
  var F = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, C5: 523.25 };
  var TUNE = [
    ["E4",1],["E4",1],["E4",2], ["E4",1],["E4",1],["E4",2],
    ["E4",1],["G4",1],["C4",1.5],["D4",0.5],["E4",4],
    ["F4",1],["F4",1],["F4",1.5],["F4",0.5], ["F4",1],["E4",1],["E4",1],["E4",0.5],["E4",0.5],
    ["E4",1],["D4",1],["D4",1],["E4",1], ["D4",2],["G4",2],
    ["E4",1],["E4",1],["E4",2], ["E4",1],["E4",1],["E4",2],
    ["E4",1],["G4",1],["C4",1.5],["D4",0.5],["E4",4],
    ["F4",1],["F4",1],["F4",1.5],["F4",0.5], ["F4",1],["E4",1],["E4",1],["E4",0.5],["E4",0.5],
    ["G4",1],["G4",1],["F4",1],["D4",1], ["C4",4]
  ];
  var BEAT = 0.32, REST = 2;

  function bell(freq, t, dur) {
    [1, 2, 3].forEach(function (h, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * h;
      var peak = [0.5, 0.15, 0.05][i];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, 0.25) * 1.6);
      o.connect(g); g.connect(gain);
      o.start(t); o.stop(t + Math.max(dur, 0.25) * 1.7);
    });
  }

  function loop() {
    if (!playing) return;
    var t = ctx.currentTime + 0.05, total = 0;
    TUNE.forEach(function (n) { bell(F[n[0]], t + total * BEAT, n[1] * BEAT); total += n[1]; });
    timer = setTimeout(loop, (total + REST) * BEAT * 1000);
  }

  function start() {
    if (playing || muted) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (!gain) { gain = ctx.createGain(); gain.gain.value = 0.12; gain.connect(ctx.destination); }
      ctx.resume();
      playing = true;
      loop();
    } catch (e) { playing = false; }
    paint();
  }

  function stop() {
    playing = false;
    clearTimeout(timer);
    if (ctx) ctx.suspend();
    paint();
  }

  function paint() {
    btn.textContent = playing ? "🔊" : "🔇";
    btn.setAttribute("aria-label", playing ? "Σίγαση μουσικής" : "Αναπαραγωγή μουσικής");
    btn.title = btn.getAttribute("aria-label");
  }

  btn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    if (playing) { muted = true; stop(); } else { muted = false; start(); }
    try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch (e) {}
  });

  function firstInteraction() {
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      window.removeEventListener(ev, firstInteraction, true);
    });
    start();
  }


  function init() {
    if (!updateLabel()) return;           // out of season: nothing at all
    document.body.appendChild(bar);
    paint();
    setInterval(function () { if (!updateLabel()) { stop(); bar.remove(); } }, 60000);
    start();                               // works only if the browser already allows sound
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, firstInteraction, { capture: true, passive: true });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
