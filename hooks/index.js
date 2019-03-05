import { useState, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight
  ]);

  const handleResize = () => {
    setWindowSize([
      window.innerWidth,
      window.innerHeight
    ]);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export const useMeasure = () => {
  const ref = useRef();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
  useEffect(() => (ro.observe(ref.current), ro.disconnect), []);
  return [{ ref }, bounds];
}

/*
  Does the order of useEffx matter?
  Can also be an instance var (useRef)
*/
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
}

export const useDevice = () => {
  const [width] = useWindowSize();
  const [device, setDevice] = useState({});

  useEffect(() => {
    if (width <= 480) {
      setDevice({ isSmall: true });
    } else if (width <= 767 && width < 979) {
      setDevice({ isPhone: true });
    } else if (width <= 979 && width < 1200) {
      setDevice({ isTablet: true });
    } else {
      setDevice({ isDesktop: true });
    }
  }, [width]);

  return device;
}