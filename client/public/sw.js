const CACHE_NAME = 'recettes-ai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression du cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes vers les extensions Chrome et autres protocoles non supportés
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('ms-browser-extension://') ||
      event.request.url.startsWith('webkit-extension://')) {
    return;
  }

  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la ressource du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, fetch depuis le réseau
        return fetch(event.request).then(response => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Vérifier que l'URL est cacheable
          if (event.request.url.startsWith('http://') || event.request.url.startsWith('https://')) {
            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.warn('Erreur lors de la mise en cache:', err);
              });
          }

          return response;
        }).catch(error => {
          console.warn('Erreur fetch:', error);
          // Retourner une réponse par défaut ou du cache si disponible
          return caches.match('/') || new Response('Contenu hors ligne non disponible');
        });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle recette disponible !',
    icon: '/logo192.png',
    badge: '/favicon.ico',
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ],
    tag: 'recette-notification',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('RecettesAI', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Gestion des messages du client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});