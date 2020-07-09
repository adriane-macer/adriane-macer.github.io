'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "469643f772797fa71901449ef76d3b1e",
"assets/assets/images/beef_noodles.png": "d251834619d5e344cdb6cabc507cc903",
"assets/assets/images/bill.png": "fa6b7d23f0f3abca1ea263a34b0a05fe",
"assets/assets/images/bread.png": "7c39cbd39db2a0f59149ff59afe5b4c5",
"assets/assets/images/calendar.png": "ac7c25ed5a2d87135b3740222e6212dd",
"assets/assets/images/cart.png": "19f86e4772ef346a18d1f92d7d755ddb",
"assets/assets/images/coffee.png": "53d845a9175a6e191c88382f363d8e63",
"assets/assets/images/corned_beef.png": "016d6cba1cc836deb5e20c9967d87425",
"assets/assets/images/eggs.png": "6a7b640a90710e922cc4bbdf71a3cd51",
"assets/assets/images/fishes.png": "61fa8d9d17489da56a8948757d4bb563",
"assets/assets/images/flags.png": "9d0e122a8d3c9bbe85647feb5e3cac35",
"assets/assets/images/form.png": "e192fc9d305b8af1775402578b30dc90",
"assets/assets/images/fruits.png": "aa21a61fb6380e4dd634197715e6f44c",
"assets/assets/images/juice.png": "8b2913d4c654a5ca72e1cc493e8b6d45",
"assets/assets/images/milk.png": "fd2b603a15e114bdb983099881f4cb09",
"assets/assets/images/mistery_box.png": "916835f9db45d983f799efa0ab09ece7",
"assets/assets/images/money.png": "33b32c3b70c7490e3df890212687716f",
"assets/assets/images/mystery_box.png": "916835f9db45d983f799efa0ab09ece7",
"assets/assets/images/nganga.png": "8199b07600c737518258ba12310cd9ed",
"assets/assets/images/not_listed.png": "1c2e12f1fdff62edb74d3aae505a5911",
"assets/assets/images/opened_box.png": "5f39e523a06c9dcf1af60be2fd38e81e",
"assets/assets/images/pancit_canton.png": "5d64388ebaf0cec9b1fe03b99d42dfa9",
"assets/assets/images/raffle.png": "4b006308e85d560149d611573f9d8f3f",
"assets/assets/images/rice.png": "b704363098bd9120e0ca1e5a6d9e0f44",
"assets/assets/images/sardinas.png": "5c5571fa5469fd683697a9f8520ab69d",
"assets/assets/images/scissors_comb.png": "20b2cf5f1f21161ec8e25b3148c6e8d7",
"assets/assets/images/seeds.png": "88d91588390e5452b7d1b078eab7359a",
"assets/assets/images/sugar.png": "9dbac53694c48534d73e8f834c271d8f",
"assets/assets/images/telescope.png": "c07ba6f2069b1a28f5dfa77cbd3e05a0",
"assets/assets/images/tooth_brush.png": "d675eccce31ff6dc8fb41f76af16eaa9",
"assets/assets/images/vegetables.png": "748295fa0e097325522696231a0053f4",
"assets/assets/images/vitamins.png": "3e3c61f937f2b50938fdd8155f603697",
"assets/assets/images/voucher.png": "e723c8c9e138515d8f22d034913022b5",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/NOTICES": "ad50ecc38c3add69d2a856c11c578d25",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "3ee4287f9c8ea9c13d8c2308a69a609f",
"/": "3ee4287f9c8ea9c13d8c2308a69a609f",
"main.dart.js": "64c86f40ccff9cf31aafb3613d20b343",
"manifest.json": "9e326022296e556ffcb1bd9692a207db"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.message == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
