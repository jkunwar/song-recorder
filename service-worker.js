const CACHE_NAME = 'version1';

self.addEventListener('install', (event) => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll([
                '/song-recorder/',
                '/song-recorder/index.html',
                '/song-recorder/css/style.css',
                '/song-recorder/js/main.js',
                '/song-recorder/manifest.json',
                '/song-recorder/icons/favicon-196.png',
                '/song-recorder/images/music-note.png',
            ])
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(cacheName => cacheName != CACHE_NAME).map(item => caches.delete(item)))
    }))
});

self.addEventListener('fetch', (event) => {

    // STALE WHILE REVALIDATE
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchedResponse = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone())
                    return networkResponse
                })
                return cachedResponse || fetchedResponse
            })
        })
    )
});

self.addEventListener('synce', event => {
    console.log(event.tag)
})