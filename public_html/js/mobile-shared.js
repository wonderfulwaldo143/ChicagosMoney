(() => {
  const PREF_KEY = 'cm-prefers-desktop';

  try {
    const params = new URLSearchParams(window.location.search);
    const viewPref = params.get('view');

    if (viewPref === 'mobile') {
      localStorage.removeItem(PREF_KEY);
    } else if (viewPref === 'desktop') {
      localStorage.setItem(PREF_KEY, '1');
    }

    if (viewPref !== null) {
      params.delete('view');
      const updatedQuery = params.toString();
      const nextUrl = window.location.pathname + (updatedQuery ? `?${updatedQuery}` : '') + window.location.hash;
      window.history.replaceState({}, '', nextUrl);
    }
  } catch (error) {
    console.warn('Mobile preference handling failed:', error);
  }

  const navToggle = document.querySelector('[data-nav-toggle]');
  const navSheet = document.getElementById('mobile-nav');
  const setNavState = (open) => {
    if (!navSheet || !navToggle) return;
    navSheet.dataset.open = open ? 'true' : 'false';
    navSheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  };

  if (navToggle && navSheet) {
    navToggle.addEventListener('click', () => {
      const isOpen = navSheet.dataset.open === 'true';
      setNavState(!isOpen);
    });

    navSheet.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.closeNav === 'true' || target === navSheet) {
        setNavState(false);
      }
    });

    navSheet.addEventListener('transitionend', () => {
      if (navSheet.dataset.open !== 'true') {
        navSheet.scrollTop = 0;
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavState(false);
    }
  });

  const desktopPrefTriggers = document.querySelectorAll('[data-desktop-pref="true"]');
  desktopPrefTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      try {
        localStorage.setItem(PREF_KEY, '1');
      } catch (storageError) {
        console.warn('Unable to persist desktop preference:', storageError);
      }
      setNavState(false);
      const targetHref = trigger.getAttribute('href') || '/?view=desktop';
      const nextLocation = targetHref.includes('view=desktop') ? targetHref : '/?view=desktop';
      window.location.href = nextLocation;
    });
  });

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach((link) => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
      if (linkPath === currentPath) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    } catch (error) {
      console.warn('Unable to evaluate nav link', error);
    }
  });
})();
