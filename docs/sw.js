// Chicago's Money Service Worker v1.0
// Provides offline support and caching for PWA

const CACHE_NAME = 'chicagos-money-v4';
const urlsToCache = [
  '/',
  '/budget-dashboard.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/IMG/chicagos_money_logo_variant_1.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Bebas+Neue&display=swap'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache install error:', err))
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }

  // Skip Formspree requests
  if (event.request.url.includes('formspree.io')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            // Don't cache API calls or analytics
            if (!event.request.url.includes('google-analytics') && 
                !event.request.url.includes('googletagmanager')) {
              cache.put(event.request, responseToCache);
            }
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache then return explicit error response
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            return Response.error();
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'email-signup') {
    event.waitUntil(
      // Retry failed email signups
      self.registration.showNotification('Chicago\'s Money', {
        body: 'Your email signup has been submitted!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      })
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from Chicago\'s Money',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Update',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Chicago\'s Money Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('https://chicagosmoney.com')
    );
  }
});

// Message handler for skip waiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
