/* utsoree.github.io — site behaviour. Vanilla JS, no dependencies.
   Everything here is progressive enhancement: the site is fully readable
   and navigable with JavaScript disabled. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Active navigation state
     --------------------------------------------------------------- */
  function markActiveNav() {
    var page = document.body.dataset.page;
    if (!page) return;
    var link = document.querySelector('.nav a[data-nav="' + page + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (toggle.getAttribute("aria-expanded") === "true") close();
      else open();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    // Close when the layout returns to the desktop nav.
    var wide = window.matchMedia("(min-width: 861px)");
    var onChange = function (e) {
      if (e.matches) close();
    };
    if (wide.addEventListener) wide.addEventListener("change", onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  /* ---------------------------------------------------------------
     Header shadow on scroll
     --------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     Content is visible by default in CSS; the hiding class is only
     added once we know IntersectionObserver can reveal it again.
     --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 5) * 55 + "ms";
      observer.observe(el);
    });

    // Safety net: if anything is still hidden after 2s, show it.
    window.setTimeout(function () {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach(function (el) {
        el.classList.add("is-in");
      });
    }, 2000);
  }

  /* ---------------------------------------------------------------
     Research filters
     --------------------------------------------------------------- */
  function initFilters() {
    var bar = document.querySelector("[data-filters]");
    if (!bar) return;

    var buttons = bar.querySelectorAll("[data-filter]");
    var groups = document.querySelectorAll("[data-group]");
    var entries = document.querySelectorAll("[data-kind]");

    bar.hidden = false;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.dataset.filter;

        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });

        entries.forEach(function (entry) {
          entry.hidden = !(value === "all" || entry.dataset.kind === value);
        });

        // Hide a section heading whose entries are all filtered out.
        groups.forEach(function (group) {
          var visible = group.querySelectorAll("[data-kind]:not([hidden])");
          group.hidden = visible.length === 0;
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     Copy to clipboard
     --------------------------------------------------------------- */
  function initCopy() {
    var buttons = document.querySelectorAll("[data-copy]");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      if (!navigator.clipboard) {
        btn.hidden = true;
        return;
      }
      btn.hidden = false;

      var original = btn.querySelector("[data-copy-label]");

      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(btn.dataset.copy).then(
          function () {
            btn.classList.add("is-done");
            if (original) original.textContent = "Copied";
            window.setTimeout(function () {
              btn.classList.remove("is-done");
              if (original) original.textContent = "Copy";
            }, 1800);
          },
          function () {
            if (original) original.textContent = "Press Ctrl+C";
          }
        );
      });
    });
  }

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    markActiveNav();
    initNav();
    initHeaderScroll();
    initReveal();
    initFilters();
    initCopy();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
