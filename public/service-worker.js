const CACHE_NAME = 'cuidaai-v1';
const urlsToCache = [
  '/',
  '/ia',
  '/ia_perfil',
  '/login',
  '/cadastrar',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Buscar recursos
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de extensões do Chrome
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Ignorar requisições POST, PUT, DELETE (não podem ser cacheadas)
  if (event.request.method !== 'GET') {
    return;
  }

  // Estratégia Network First para API
  if (event.request.url.includes('/api/') || event.request.url.includes('infodental.dental')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Só cachear respostas válidas de GET
          if (response.ok && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Estratégia Cache First para assets estáticos
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            // Validações antes de cachear
            if (!response || 
                response.status !== 200 || 
                response.type !== 'basic' ||
                event.request.method !== 'GET') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
    );
  }
});