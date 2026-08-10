const CACHE_NAME = 'permai-court-cache-v3';

const APP_SHELL = [
    '/permaicourt1/',
    '/permaicourt1/index.html',

    // HALAMAN UTAMA PWA
    '/permaicourt1/main.html',

    '/permaicourt1/manifest.json',

    '/permaicourt1/icon-192.png',
    '/permaicourt1/icon-512.png',
    '/permaicourt1/icon-maskable-512.png',

    '/permaicourt1/img/jmb1.png'
];


/* ============================================================
   INSTALL
============================================================ */

self.addEventListener(
    'install',
    event => {

        console.log(
            '[SW] Install'
        );


        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(
                    cache => {

                        return cache.addAll(
                            APP_SHELL
                        );

                    }
                )

                .then(
                    () => {

                        return self.skipWaiting();

                    }
                )

        );

    }
);



/* ============================================================
   ACTIVATE
============================================================ */

self.addEventListener(
    'activate',
    event => {

        console.log(
            '[SW] Activate'
        );


        event.waitUntil(

            caches.keys()

                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames

                                .filter(
                                    cacheName =>
                                        cacheName !== CACHE_NAME
                                )

                                .map(
                                    cacheName =>
                                        caches.delete(
                                            cacheName
                                        )
                                )

                        );

                    }
                )

                .then(
                    () => {

                        return self.clients.claim();

                    }
                )

        );

    }
);



/* ============================================================
   FETCH
============================================================ */

self.addEventListener(
    'fetch',
    event => {

        const request =
            event.request;


        /*
         * Hanya proses GET.
         */

        if (
            request.method !== 'GET'
        ) {

            return;

        }



        /*
         * Navigation request:
         *
         * Jika pengguna buka page ketika offline,
         * gunakan index.html daripada cache.
         */

        if (
            request.mode === 'navigate'
        ) {

            event.respondWith(

                fetch(request)

                    .then(
                        response => {

                            return response;

                        }
                    )

                    .catch(
                        () => {

                            return caches.match(
                                '/permaicourt1/index.html'
                            );

                        }
                    )

            );

            return;

        }



        /*
         * Aset biasa:
         *
         * Cache dahulu.
         * Jika tiada, ambil daripada network.
         */

        event.respondWith(

            caches.match(request)

                .then(
                    cachedResponse => {

                        if (cachedResponse) {

                            return cachedResponse;

                        }


                        return fetch(request)

                            .then(
                                networkResponse => {

                                    /*
                                     * Simpan aset same-origin
                                     * ke cache untuk penggunaan
                                     * seterusnya.
                                     */

                                    if (
                                        networkResponse &&
                                        networkResponse.status === 200 &&
                                        new URL(
                                            request.url
                                        ).origin === location.origin
                                    ) {

                                        const responseClone =
                                            networkResponse.clone();


                                        caches.open(
                                            CACHE_NAME
                                        )
                                        .then(
                                            cache => {

                                                cache.put(
                                                    request,
                                                    responseClone
                                                );

                                            }
                                        );

                                    }


                                    return networkResponse;

                                }
                            );

                    }
                )

        );

    }
);
