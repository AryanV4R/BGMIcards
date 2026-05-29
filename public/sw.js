self.addEventListener('push', function(event) {
  // ✅ Agar data hi nahi aaya toh crash mat karo
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch(e) {
    // ✅ JSON parse fail ho toh plain text use karo
    data = { title: 'BGMIcards', body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      badge: '/icon.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});