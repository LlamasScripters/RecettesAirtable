import { useState, useEffect } from 'react';
import { Download, X, Bell, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { useNotifications } from '../hooks/useNotifications';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  
  const {
    permission,
    isSubscribed,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification
  } = useNotifications();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Utilisateur a accepté l\'installation');
      setShowNotificationPrompt(true);
    } else {
      console.log('Utilisateur a refusé l\'installation');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleNotificationSetup = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribeToPush();
      sendTestNotification();
    }
    setShowNotificationPrompt(false);
  };

  const handleNotificationToggle = async () => {
    if (isSubscribed) {
      await unsubscribeFromPush();
    } else {
      const granted = await requestPermission();
      if (granted) {
        await subscribeToPush();
      }
    }
  };

  if (!isInstallable && !isInstalled && !permission.granted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Prompt d'installation */}
      {isInstallable && (
        <div className="mb-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">
                Installer RecettesAI
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Accédez rapidement à vos recettes depuis votre écran d'accueil
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Installer
                </Button>
                <Button
                  onClick={() => setIsInstallable(false)}
                  variant="outline"
                  size="sm"
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt de notifications après installation */}
      {showNotificationPrompt && (
        <div className="mb-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">
                Activer les notifications
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Recevez des alertes pour les nouvelles recettes et rappels de cuisine
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleNotificationSetup}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Activer
                </Button>
                <Button
                  onClick={() => setShowNotificationPrompt(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton toggle notifications (si installé) */}
      {isInstalled && (
        <Button
          onClick={handleNotificationToggle}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
        >
          {isSubscribed ? (
            <BellOff className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}