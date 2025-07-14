import { useState, useEffect } from 'react';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    prompt: false
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Vérifier le support des notifications
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        prompt: currentPermission === 'default'
      });
    }

    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Service Worker enregistré:', reg);
          setRegistration(reg);
          
          // Vérifier si déjà abonné aux notifications push
          return reg.pushManager.getSubscription();
        })
        .then(subscription => {
          setIsSubscribed(!!subscription);
        })
        .catch(error => {
          console.error('Erreur Service Worker:', error);
        });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const result = await Notification.requestPermission();
    const newPermission = {
      granted: result === 'granted',
      denied: result === 'denied',
      prompt: result === 'default'
    };
    
    setPermission(newPermission);
    return result === 'granted';
  };

  const subscribeToPush = async (): Promise<boolean> => {
    if (!registration) {
      console.error('Service Worker non enregistré');
      return false;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // Clé publique VAPID - À remplacer par votre clé
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80NrGTJU7xfFkCPOLSvGcBaAFJxiSEjLtBq9dKWGGGNLZdPsYU9lKSiM'
        )
      });

      setIsSubscribed(true);
      
      // Envoyer la subscription au serveur
      await sendSubscriptionToServer(subscription);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!registration) {
      return false;
    }

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        
        // Informer le serveur du désabonnement
        await removeSubscriptionFromServer(subscription);
        
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
    }
    
    return false;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission.granted) {
      new Notification(title, {
        icon: '/logo192.png',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  const sendTestNotification = () => {
    sendNotification('Test de notification', {
      body: 'Ceci est une notification de test pour RecettesAI',
      tag: 'test-notification'
    });
  };

  return {
    permission,
    isSubscribed,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
    sendTestNotification
  };
}

// Fonction utilitaire pour convertir la clé VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Fonction pour envoyer la subscription au serveur
async function sendSubscriptionToServer(subscription: PushSubscription) {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de la subscription');
    }
  } catch (error) {
    console.error('Erreur API subscription:', error);
  }
}

// Fonction pour supprimer la subscription du serveur
async function removeSubscriptionFromServer(subscription: PushSubscription) {
  try {
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la subscription');
    }
  } catch (error) {
    console.error('Erreur API unsubscribe:', error);
  }
}