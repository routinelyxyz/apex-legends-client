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