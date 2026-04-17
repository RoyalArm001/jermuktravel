const BUILD_ID = new URL(self.location.href).searchParams.get('v') || 'dev';
const SHELL_CACHE = `jermuk-shell-${BUILD_ID}`;
const ASSET_CACHE = `jermuk-assets-${BUILD_ID}`;
const CACHE_PREFIX = 'jermuk-';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-512-maskable.png',
  '/icons/jermuk-logo-v2.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheKeys = await caches.keys();

    await Promise.all(
      cacheKeys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== ASSET_CACHE)
        .map((key) => caches.delete(key)),
    );

    if ('navigationPreload' in self.registration) {
      try {
        await self.registration.navigationPreload.enable();
      } catch {}
    }

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || url.pathname === '/sw.js') {
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(event));
    return;
  }

  if (isStaticAssetRequest(request, url)) {
    event.respondWith(handleStaticAssetRequest(event));
  }
});

function isNavigationRequest(request) {
  if (request.mode === 'navigate' || request.destination === 'document') {
    return true;
  }

  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

function isStaticAssetRequest(request, url) {
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    return true;
  }

  if (url.pathname === '/favicon.svg' || url.pathname.endsWith('.webmanifest')) {
    return true;
  }

  return ['style', 'script', 'worker', 'image', 'font'].includes(request.destination);
}

async function cacheResponse(cacheName, request, response) {
  if (!response || !response.ok || response.type === 'opaque') {
    return response;
  }

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

async function handleNavigationRequest(event) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const preloadResponse = await event.preloadResponse;

    if (preloadResponse) {
      await cacheResponse(SHELL_CACHE, event.request, preloadResponse.clone());
      return preloadResponse;
    }

    const networkResponse = await fetch(event.request);
    await cacheResponse(SHELL_CACHE, event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const fallbackResponse = await cache.match('/');

    if (fallbackResponse) {
      return fallbackResponse;
    }

    throw error;
  }
}

async function handleStaticAssetRequest(event) {
  const cache = await caches.open(ASSET_CACHE);
  const cachedResponse = await cache.match(event.request);
  const networkRequest = fetch(event.request)
    .then((response) => cacheResponse(ASSET_CACHE, event.request, response))
    .catch(() => null);

  if (cachedResponse) {
    event.waitUntil(networkRequest);
    return cachedResponse;
  }

  const networkResponse = await networkRequest;

  if (networkResponse) {
    return networkResponse;
  }

  return fetch(event.request);
}
