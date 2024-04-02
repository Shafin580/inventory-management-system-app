"use strict"
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...", event)
})

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...", event)
  // event.waitUntil(
  //   caches.open('wishlist-cache'))
  return self.clients.claim()
})

// self.addEventListener("fetch", (event) => {
//   console.log("[Service Worker] Fetching Something...", event)
//   event.respondWith(fetch(event.request))
// })
