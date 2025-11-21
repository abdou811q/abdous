const CACHE_NAME = 'physics-fall-sim-cache-v2';
// Essential files to cache on install for the app shell to work offline.
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg', // The icon used in manifest
    '/index.tsx', // The main script
    'https://cdn.tailwindcss.com' // Main CSS framework
];

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache for pre-caching');
                // We use addAll which is atomic. If any fetch fails, the SW install fails.
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Try to get the response from the cache.
            const cachedResponse = await cache.match(event.request);
            
            // Fetch from the network in the background.
            const fetchedResponsePromise = fetch(event.request).then((networkResponse) => {
                // If we got a valid response, update the cache.
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(error => {
                // The network request failed. This is expected when offline.
                console.warn('Fetch failed; returning offline page instead.', error);
                // Return a simple error response if network fails and there's no cache.
                return new Response('Network error trying to fetch resource.', {
                    status: 408, // Request Timeout
                    headers: { 'Content-Type': 'text/plain' },
                });
            });

            // Return the cached response if we have one, otherwise wait for the network.
            // This is a "stale-while-revalidate" strategy.
            return cachedResponse || fetchedResponsePromise;
        })
    );
});


// Clean up old caches on activation
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    
    // Take control of all clients immediately
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});