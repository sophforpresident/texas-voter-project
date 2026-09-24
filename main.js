// Texas Voter Project — shared site script
// Handles the mobile nav toggle. Kept intentionally small: no framework, no build step.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.nav-mobile');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the mobile menu when a nav link is tapped.
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// Events page: hide any upcoming-event card whose end time (data-end, ISO/UTC,
// copied from the matching Qomon Action) has already passed — so the page
// never shows stale events without a manual edit.
document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.event-card[data-end]');
  if (!cards.length) return;
  var now = Date.now();
  cards.forEach(function (card) {
    var end = Date.parse(card.getAttribute('data-end'));
    if (!isNaN(end) && end < now) card.hidden = true;
  });
});
