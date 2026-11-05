// NTRN Solar House daylight theme for static sites (no React).
// Plain-JS stand-in for SolarHouse.DaylightTheme: `day` from local sunrise, `night` after sunset,
// with a manual override. The sun position is the NOAA approximation from NTRN v4.0.0
// src/solar-house/components/solar-house.js (solarAltitude), at the Solar House default
// location (Los Angeles, 34.05, -118.24), so every reader sees the house's daylight.
//
// Load it in <head>, not deferred, so the theme is set before first paint. Contract:
//   - <html data-theme="day|night">: the Solar House theme (tokens.css keys on it).
//   - <html saved-theme="light|dark"> and <html data-ntrn-mode="light|dark">: the same as light/dark
//     (Quartz keys code highlighting and its giscus theme on saved-theme).
//   - <html data-daylight="sun|day|night">: the reader's choice; `sun` (default) follows the sun.
//   - any <select data-ntrn-theme> becomes the control (options filled in if empty).
//   - ?theme=sun|day|night in the URL selects and stores a choice (shareable previews, screenshots).
//   - fires document "themechange" ({detail: {theme: "light"|"dark"}}, Quartz convention) on every change.
(function () {
  var KEY = "ntrn-daylight";
  var CHOICES = [
    ["sun", "follow sun"],
    ["day", "day"],
    ["night", "night"],
  ];
  var LAT = 34.05;
  var LON = -118.24;
  var timer = null;

  function solarAltitude(date) {
    var rad = Math.PI / 180;
    var jd = date.getTime() / 86400000 + 2440587.5,
      n = jd - 2451545.0;
    var L = (280.46 + 0.9856474 * n) % 360,
      g = ((357.528 + 0.9856003 * n) % 360) * rad;
    var lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
    var eps = (23.439 - 0.0000004 * n) * rad;
    var dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
    var ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
    var gmst = (18.697374558 + 24.06570982441908 * n) % 24;
    var ha = (gmst * 15 + LON) * rad - ra;
    var alt = Math.asin(
      Math.sin(LAT * rad) * Math.sin(dec) + Math.cos(LAT * rad) * Math.cos(dec) * Math.cos(ha),
    );
    return alt / rad;
  }

  function sunPhase() {
    return solarAltitude(new Date()) > -0.833 ? "day" : "night";
  }

  function isChoice(c) {
    for (var i = 0; i < CHOICES.length; i++) if (CHOICES[i][0] === c) return true;
    return false;
  }

  function choice() {
    try {
      var q = new URLSearchParams(location.search).get("theme");
      if (isChoice(q)) localStorage.setItem(KEY, q);
      var c = localStorage.getItem(KEY);
      return isChoice(c) ? c : "sun";
    } catch (e) {
      return "sun";
    }
  }

  function mode(theme) {
    return theme === "night" ? "dark" : "light";
  }

  function recheckMs() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--dur-daylight").trim();
    var n = parseFloat(v);
    if (isNaN(n)) return 60000;
    return /ms$/.test(v) ? n : n * 1000;
  }

  function apply(c, announce) {
    var root = document.documentElement;
    var theme = c === "sun" ? sunPhase() : c;
    var changed = root.getAttribute("data-theme") !== theme;
    root.setAttribute("data-daylight", c);
    root.setAttribute("data-theme", theme);
    root.setAttribute("saved-theme", mode(theme));
    root.setAttribute("data-ntrn-mode", mode(theme));
    if (announce && changed) {
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: mode(theme) } }));
    }
  }

  function follow(c) {
    clearInterval(timer);
    timer = null;
    if (c !== "sun") return;
    timer = setInterval(function () {
      apply("sun", true);
    }, recheckMs());
  }

  function bind() {
    var c = choice();
    apply(c, false);
    var selects = document.querySelectorAll("select[data-ntrn-theme]");
    for (var i = 0; i < selects.length; i++) {
      var sel = selects[i];
      if (!sel.options.length) {
        for (var j = 0; j < CHOICES.length; j++) sel.add(new Option(CHOICES[j][1], CHOICES[j][0]));
      }
      sel.value = c;
      if (sel.getAttribute("data-ntrn-bound")) continue;
      sel.setAttribute("data-ntrn-bound", "1");
      sel.addEventListener("change", function (ev) {
        var next = ev.target.value;
        try {
          localStorage.setItem(KEY, next);
        } catch (e) {}
        apply(next, true);
        follow(next);
      });
    }
    follow(c);
  }

  window.NTRNDaylight = { choices: CHOICES, choice: choice, sunPhase: sunPhase, mode: mode };
  apply(choice(), false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  document.addEventListener("nav", bind); // Quartz SPA navigation re-renders the page body
})();
