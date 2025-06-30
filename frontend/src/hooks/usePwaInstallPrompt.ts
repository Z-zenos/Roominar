import { useEffect, useState } from 'react';

export const usePwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handler as EventListener,
      );
    };
  }, []);

  const promptInstall = async () => {
    if ((deferredPrompt as any)?.prompt) {
      (deferredPrompt as any).prompt();
      const result = await (deferredPrompt as any).userChoice;
      return result;
    }
  };

  return { deferredPrompt, promptInstall };
};
