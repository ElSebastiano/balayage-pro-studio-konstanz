(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav toggle */
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero pointer parallax (desktop only, respects reduced motion) */
  var heroVisual = document.querySelector(".hero-visual");
  var parallaxEls = document.querySelectorAll("[data-parallax]");

  if (heroVisual && parallaxEls.length && !reduceMotion && window.matchMedia("(min-width: 900px)").matches && window.matchMedia("(pointer: fine)").matches) {
    var hero = document.querySelector(".hero");
    var rafId = null;
    var targetX = 0;
    var targetY = 0;

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;

      if (rafId === null) {
        rafId = requestAnimationFrame(applyParallax);
      }
    });

    hero.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyParallax);
      }
    });

    function applyParallax() {
      parallaxEls.forEach(function (el) {
        var strength = parseFloat(el.getAttribute("data-parallax")) || 4;
        var x = targetX * strength;
        var y = targetY * strength;
        el.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
      });
      rafId = null;
    }
  }

  /* Subtle card-level reveal (portfolio, pricing, steps) — never hides content by default,
     only nudges opacity slightly so nothing depends on JS/scroll timing to be visible. */
  var revealTargets = document.querySelectorAll(".portfolio-card, .price-card, .step-card");

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = "0.001";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });

    /* Safety net: guarantee full visibility shortly after load even if an
       observer never fires (e.g. a full-page render/capture tool). */
    window.setTimeout(function () {
      revealTargets.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }, 1800);
  }

  /* Sticky header shadow on scroll */
  var header = document.getElementById("site-header");
  if (header) {
    var lastState = false;
    window.addEventListener(
      "scroll",
      function () {
        var scrolled = window.scrollY > 12;
        if (scrolled !== lastState) {
          header.style.boxShadow = scrolled ? "0 8px 24px rgba(32,37,34,0.06)" : "none";
          lastState = scrolled;
        }
      },
      { passive: true }
    );
  }
})();
