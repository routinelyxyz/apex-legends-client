import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { ModalContext } from '../helpers/context';

export const useWindowSize = () => {
  const client = typeof window !== 'undefined';

  const [windowSize, setWindowSize] = useState([
    client ? window.innerWidth : 0,
    client ? window.innerHeight : 0
  ]);

  const handleResize = () => {
    setWindowSize([
      window.innerWidth,
      window.innerHeight
    ]);
  }

  useEffect(() => {
    if (client) {
      window.addEventListener('resize', handleResize);
    }    
    return () => client && window.removeEventListener('resize', handleResize);
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
export const useMounted = (fn) => {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current && fn) {
      fn();
    }
    mounted.current = true;

    return () => mounted.current = false;
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