import { useState, useEffect } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
}

function getWindowDimensions(): WindowDimensions {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window;

    return {
      width,
      height,
    };
  } else {
    // Provide default values for the server side
    return {
      width: 0,
      height: 0,
    };
  }
}

export default function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (typeof window !== 'undefined') {
      setWindowDimensions(getWindowDimensions());
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
}
