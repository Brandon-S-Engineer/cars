/* ==========================================================================
   Edith Soria — lógica compartida (vanilla JS, sin dependencias)
   - WhatsApp: arma links con mensaje pre-llenado desde [data-msg]
   - Menú móvil
   - Filtros de catálogo (marca / precio / disponibilidad / búsqueda)
   - Estimador de financiamiento
   ========================================================================== */
(function () {
  "use strict";

  // --- WhatsApp -------------------------------------------------------------
  // Número de Edith. Para México en wa.me se usa 52 + 10 dígitos.
  var WA_NUMBER = "525581631195";
  var WA_BASE = "https://wa.me/" + WA_NUMBER;

  function wireWhatsApp() {
    document.querySelectorAll("a.js-wa, a[data-msg]").forEach(function (a) {
      var msg = a.getAttribute("data-msg") || "Hola Edith, vi tu catálogo y quiero más información.";
      a.setAttribute("href", WA_BASE + "?text=" + encodeURIComponent(msg));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  // --- Menú móvil -----------------------------------------------------------
  function wireMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", open ? "false" : "true");
      menu.classList.toggle("hidden", open);
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.setAttribute("data-open", "false");
        menu.classList.add("hidden");
      });
    });
  }

  // --- Filtros del catálogo -------------------------------------------------
  function wireCatalog() {
    var grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
    var brandBtns = document.querySelectorAll("[data-filter-brand]");
    var priceSel = document.querySelector("[data-filter-price]");
    var availChk = document.querySelector("[data-filter-avail]");
    var search = document.querySelector("[data-filter-search]");
    var countEl = document.querySelector("[data-result-count]");
    var emptyEl = document.querySelector("[data-empty]");

    var state = { brand: "todas", maxPrice: 0, demoOnly: false, q: "" };

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var brand = (card.getAttribute("data-brand") || "").toLowerCase();
        var price = parseInt(card.getAttribute("data-price") || "0", 10);
        var status = card.getAttribute("data-status") || "disponible";
        var name = (card.getAttribute("data-name") || "").toLowerCase();

        var ok = true;
        if (state.brand !== "todas" && brand !== state.brand) ok = false;
        if (state.maxPrice && price > state.maxPrice) ok = false;
        if (state.demoOnly && status !== "demo") ok = false;
        if (state.q && name.indexOf(state.q) === -1) ok = false;

        card.setAttribute("data-hidden", ok ? "false" : "true");
        if (ok) visible++;
      });
      if (countEl) countEl.textContent = visible;
      if (emptyEl) emptyEl.classList.toggle("hidden", visible !== 0);
    }

    brandBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.brand = (btn.getAttribute("data-filter-brand") || "todas").toLowerCase();
        brandBtns.forEach(function (b) { b.setAttribute("data-active", b === btn ? "true" : "false"); });
        apply();
      });
    });
    if (priceSel) priceSel.addEventListener("change", function () {
      state.maxPrice = parseInt(priceSel.value || "0", 10); apply();
    });
    if (availChk) availChk.addEventListener("change", function () {
      state.demoOnly = availChk.checked; apply();
    });
    if (search) search.addEventListener("input", function () {
      state.q = search.value.trim().toLowerCase(); apply();
    });

    apply();
  }

  // --- Estimador de financiamiento -----------------------------------------
  function money(n) {
    return "$" + Math.round(n).toLocaleString("es-MX");
  }
  function wireFinance() {
    var root = document.querySelector("[data-finance]");
    if (!root) return;

    var price = parseInt(root.getAttribute("data-finance") || "0", 10);
    var downRange = root.querySelector("[data-down]");
    var termSel = root.querySelector("[data-term]");
    var downPct = root.querySelector("[data-down-pct]");
    var downAmt = root.querySelector("[data-down-amt]");
    var amountFin = root.querySelector("[data-amount-fin]");
    var monthly = root.querySelector("[data-monthly]");
    var waBtn = root.querySelector("a.js-wa-finance");

    // Tasa anual aproximada (CAT ilustrativo). Solo estimación.
    var ANNUAL = 0.139;

    function calc() {
      var pct = parseInt(downRange.value, 10);
      var down = price * (pct / 100);
      var principal = price - down;
      var n = parseInt(termSel.value, 10);
      var r = ANNUAL / 12;
      var pmt = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      if (downPct) downPct.textContent = pct + "%";
      if (downAmt) downAmt.textContent = money(down);
      if (amountFin) amountFin.textContent = money(principal);
      if (monthly) monthly.textContent = money(pmt);

      if (waBtn) {
        var msg = "Hola Edith, me interesa esta cotización: enganche de " + money(down) +
          " (" + pct + "%) a " + n + " meses, mensualidad aprox. " + money(pmt) +
          ". ¿Me confirmas los siguientes pasos?";
        waBtn.setAttribute("data-msg", msg);
        waBtn.setAttribute("href", WA_BASE + "?text=" + encodeURIComponent(msg));
      }
    }
    if (downRange) downRange.addEventListener("input", calc);
    if (termSel) termSel.addEventListener("change", calc);
    calc();
  }

  // --- Galería simple (versión) --------------------------------------------
  function wireGallery() {
    var main = document.querySelector("[data-gallery-main] .ph-tag");
    var mainBox = document.querySelector("[data-gallery-main]");
    if (!mainBox) return;
    document.querySelectorAll("[data-thumb]").forEach(function (t) {
      t.addEventListener("click", function () {
        document.querySelectorAll("[data-thumb]").forEach(function (x) { x.setAttribute("data-active", "false"); });
        t.setAttribute("data-active", "true");
        if (main) main.textContent = t.getAttribute("data-thumb");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsApp();
    wireMenu();
    wireCatalog();
    wireFinance();
    wireGallery();
  });
})();
