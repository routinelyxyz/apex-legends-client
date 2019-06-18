import { useState, useEffect, useRef, useContext, useMemo, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { ModalContext } from '../context';

export const useWindowSize = () => {
  const isClient = typeof window !== 'undefined';

  const [windowSize, setWindowSize] = useState([
    isClient ? window.innerWidth : 0,
    isClient ? window.innerHeight : 0
  ]);

  const handleResize = () => {
    setWindowSize([
      window.innerWidth,
      window.innerHeight
    ]);
  }

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', handleResize);
    }    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

interface DOMRectReadOnly {
  readonly left: number
  readonly top: number
  readonly width: number
  readonly height: number
}
type UseMeasureResult<T> = [
  { ref: RefObject<T> },
  DOMRectReadOnly
]
export function useMeasure <T>(): UseMeasureResult<T> {
  const ref = useRef<T>(null);
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
  useEffect(() => (ro.observe((ref as any).current), ro.disconnect), [ref, ro]);
  return [{ ref }, bounds];
}


export const useMounted = (callback?: () => {}) => {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current && callback) {
      callback();
    }
    mounted.current = true;

    return () => {
      mounted.current = false;
    }
  }, []);
  return mounted.current;
}
export { useMounted as useFirstRender };

export const useDevice = () => {
  const [width] = useWindowSize();

  const isSmall = width <= 480;
  const isPhone = width < 979 // && width > 480;
  const isTablet = width >= 970 && width < 1200;
  const isDesktop = width >= 1200;

  const isntDesktop = width < 1200;

  const key = '' + isSmall + isPhone + isTablet + isDesktop + isntDesktop;

  const device = useMemo(() => ({
    isSmall,
    isPhone,
    isTablet,
    isDesktop,

    isntDesktop
  }), [key]);

  return device;
}

export const useModal = () => {
  const modal = useContext(ModalContext);
  useEffect(() => () => modal.setOpened(false), []);
  return modal;
}