const staticCacheName = "static-cache-v1";
const assets = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  console.log("Installation du service worker");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Activation du service worker");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith("static-cache-") &&
              cacheName !== staticCacheName
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    }),
    self.clients.claim(),
    self.clients.matchAll().then((clients) => {
      const cspDirective =
        "script-src 'nonce-{RANDOM}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; img-src 'none'; media-src 'none'; script-src 'nonce-{RANDOM}' 'strict-dynamic'; style-src 'nonce-{RANDOM}' 'strict-dynamic'; worker-src 'none'; font-src 'none'; connect-src 'none'; child-src 'none'; manifest-src 'none'; prefetch-src 'none'; block-all-mixed-content; upgrade-insecure-requests; default-src 'none'; sandbox allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-downloads-without-user-activation;";

      // Pour limiter les risques de failles XSS, nous allons utiliser le Content Security Policy (CSP).

      clients.forEach((client) => {
        client.postMessage({
          type: "cspDirective",
          directive: cspDirective,
        });
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Récupération des fichiers en cache");
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// const staticCacheName = "static-cache-v1";
// const assets = ["/", "/index.html"];

// self.addEventListener("install", (event) => {
//   console.log("Installation du service worker");
//   event.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       return cache.addAll(assets);
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   console.log("Activation du service worker");
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames
//           .filter((cacheName) => {
//             return (
//               cacheName.startsWith("static-cache-") &&
//               cacheName !== staticCacheName
//             );
//           })
//           .map((cacheName) => {
//             return caches.delete(cacheName);
//           })
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   console.log("Récupération des fichiers en cache");
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener("message", (event) => {
//   if (event.data.action === "skipWaiting") {
//     self.skipWaiting();
//   }
// });

// self.addEventListener('activate', (event) => {
//   console.log('Activation du service worker');

//   // Directive Content-Security-Policy
//   const cspDirective = "script-src 'nonce-{RANDOM}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; img-src 'none'; media-src 'none'; script-src 'nonce-{RANDOM}' 'strict-dynamic'; style-src 'nonce-{RANDOM}' 'strict-dynamic'; worker-src 'none'; font-src 'none'; connect-src 'none'; child-src 'none'; manifest-src 'none'; prefetch-src 'none'; block-all-mixed-content; upgrade-insecure-requests; default-src 'none'; sandbox allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-downloads-without-user-activation;";

//   event.waitUntil(
//     self.clients.claim(),
//     self.clients.matchAll().then((clients) => {
//       clients.forEach((client) => {
//         client.postMessage({
//           type: 'cspDirective',
//           directive: cspDirective,
//         });
//       });
//     })
//   );
// });
