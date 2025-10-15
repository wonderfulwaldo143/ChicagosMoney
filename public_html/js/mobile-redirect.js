(() => {
  const PREF_KEY = 'cm-prefers-desktop';
  try {
    const params = new URLSearchParams(window.location.search);
    const viewPref = params.get('view');
    if (viewPref === 'desktop') {
      localStorage.setItem(PREF_KEY, '1');
    }
    if (viewPref === 'mobile') {
      localStorage.removeItem(PREF_KEY);
    }
    if (viewPref !== null) {
      params.delete('view');
      const updatedQuery = params.toString();
      const nextUrl = window.location.pathname + (updatedQuery ? `?${updatedQuery}` : '') + window.location.hash;
      window.history.replaceState({}, '', nextUrl);
    }
  } catch (error) {
    console.warn('Unable to persist mobile preference', error);
  }

  const MOBILE_ROUTES = {
    '/': '/mobile.html',
    '/index.html': '/mobile.html',
    '/about.html': '/mobile-about.html',
    '/contact.html': '/mobile-contact.html',
    '/blog.html': '/mobile-blog.html',
    '/budget-dashboard.html': '/mobile-budget.html',
    '/salary-lookup.html': '/mobile-salary.html'
  };

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/mobile.html' || path.startsWith('/mobile-')) {
    return;
  }

  try {
    if (localStorage.getItem(PREF_KEY) === '1') {
      return;
    }
  } catch (error) {
    console.warn('Unable to read desktop preference', error);
  }

  const target = MOBILE_ROUTES[path];
  if (!target) {
    return;
  }

  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const narrowViewport = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;

  if (isMobileUA || narrowViewport) {
    window.location.replace(target);
  }
})();
