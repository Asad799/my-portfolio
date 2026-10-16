document.documentElement.classList.add('js-ready');

const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const year = document.querySelector('#current-year');
const menuLabel = menuButton?.querySelector('.sr-only');

if (year) {
  year.textContent = new Date().getFullYear();
}

const closeMenu = () => {
  if (!menuButton || !siteNav) return;

  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  if (menuLabel) menuLabel.textContent = 'Open navigation';
  siteNav.classList.remove('is-open');
};

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    if (menuLabel) menuLabel.textContent = isOpen ? 'Open navigation' : 'Close navigation';
    siteNav.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const sections = document.querySelectorAll('main section[id]');
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-cta)');

if ('IntersectionObserver' in window && sections.length && sectionLinks.length) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-38% 0px -52% 0px' },
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}
