
export const debounce = (delay = 250, timeout) => fn => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}

export const round = (val, scale = 10) => Math.round(val * scale) / scale;

export const parsePercent = val => 
  val < 0
    ? 0
    : val > 100
      ? 100
      : val;

export const useDebounce = (delay = 250, timeout) => [
  fn => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  },
  timeout
];

export const getTs = () => Math.floor(Date.now() / 1000); 

export { applyCss as applyCss } from '../helpers';