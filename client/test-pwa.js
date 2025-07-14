// Script de test pour vérifier les fonctionnalités PWA

console.log('🔍 Test des fonctionnalités PWA...');

// Test 1: Service Worker
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker supporté');
  
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log('✅ Service Worker enregistré:', registrations[0]);
    } else {
      console.log('❌ Service Worker non enregistré');
    }
  });
} else {
  console.log('❌ Service Worker non supporté');
}

// Test 2: Manifest
fetch('/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest chargé:', manifest);
  })
  .catch(error => {
    console.log('❌ Erreur manifest:', error);
  });

// Test 3: Notifications
if ('Notification' in window) {
  console.log('✅ Notifications supportées');
  console.log('Permission actuelle:', Notification.permission);
} else {
  console.log('❌ Notifications non supportées');
}

// Test 4: Push API
if ('PushManager' in window) {
  console.log('✅ Push API supportée');
} else {
  console.log('❌ Push API non supportée');
}

// Test 5: Installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('✅ Prompt d\'installation disponible');
});

window.addEventListener('appinstalled', () => {
  console.log('✅ Application installée');
});

// Test 6: Mode standalone
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ Application en mode standalone');
} else {
  console.log('ℹ️ Application en mode navigateur');
}

// Test 7: Stockage local
try {
  localStorage.setItem('test-pwa', 'ok');
  const test = localStorage.getItem('test-pwa');
  if (test === 'ok') {
    console.log('✅ LocalStorage fonctionnel');
    localStorage.removeItem('test-pwa');
  }
} catch (error) {
  console.log('❌ Erreur LocalStorage:', error);
}

console.log('🏁 Test PWA terminé');