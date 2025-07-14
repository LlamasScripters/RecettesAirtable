// Script de test pour les nouvelles fonctionnalités

console.log('🧪 Test des nouvelles fonctionnalités...');

// Test 1: Vérifier les exports de l'API
try {
  import('./src/lib/api.ts').then(api => {
    console.log('✅ API exports:', Object.keys(api));
    if (api.fetchRecipes) {
      console.log('✅ fetchRecipes disponible');
    } else {
      console.log('❌ fetchRecipes manquant');
    }
  });
} catch (error) {
  console.log('❌ Erreur import API:', error.message);
}

// Test 2: Vérifier les hooks
try {
  import('./src/hooks/useInfiniteRecipes.ts').then(hook => {
    console.log('✅ useInfiniteRecipes importé');
  });
} catch (error) {
  console.log('❌ Erreur import hook:', error.message);
}

// Test 3: Vérifier les composants
try {
  import('./src/components/ViewModeToggle.tsx').then(component => {
    console.log('✅ ViewModeToggle importé');
  });
} catch (error) {
  console.log('❌ Erreur import ViewModeToggle:', error.message);
}

// Test 4: Vérifier le localStorage
try {
  localStorage.setItem('test-view-mode', 'grid');
  const viewMode = localStorage.getItem('test-view-mode');
  if (viewMode === 'grid') {
    console.log('✅ LocalStorage fonctionnel pour les vues');
  }
  localStorage.removeItem('test-view-mode');
} catch (error) {
  console.log('❌ Erreur localStorage:', error.message);
}

// Test 5: Vérifier les API Web modernes
const features = {
  'IntersectionObserver': 'IntersectionObserver' in window,
  'ServiceWorker': 'serviceWorker' in navigator,
  'PushManager': 'PushManager' in window,
  'Notification': 'Notification' in window,
  'localStorage': 'localStorage' in window,
  'fetch': 'fetch' in window
};

console.log('📱 Fonctionnalités supportées:');
Object.entries(features).forEach(([name, supported]) => {
  console.log(`${supported ? '✅' : '❌'} ${name}`);
});

// Test 6: Vérifier le manifest
fetch('/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest PWA:', manifest.name);
    console.log('📱 Icônes:', manifest.icons.length);
    console.log('🎨 Thème:', manifest.theme_color);
  })
  .catch(error => {
    console.log('❌ Erreur manifest:', error.message);
  });

console.log('🏁 Test des fonctionnalités terminé');