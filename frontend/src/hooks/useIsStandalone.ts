import { useEffect, useState } from 'react';

export function useIsStandalone() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone); // optional
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  return isStandalone;
}
