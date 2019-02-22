
export const debounce = (delay = 250, timeout) => fn => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}