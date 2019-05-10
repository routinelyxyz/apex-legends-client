
export const debounce = (delay = 250, timeout) => fn => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
  return timeout;
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

export const useDispatch = dispatch => (type, payload, meta) => 
  dispatch({ type, payload, meta });

export const filterUnique = (value, index, self) => self.indexOf(value) === index;

export const filterById = (item, index, self) =>
  self.filter(any => any.id == item.id).length < 2;

export const getUniqueById = items => Object.values(
  items.reduce((unique, item) => ({
    ...unique,
    [item.id]: item
  }), {})
);

export const scrollTo = ({ top = 0, left = 0, behavior = 'smooth'}) => {
  try {
    window.scroll({ top, left, behavior });
  } catch(err) {
    if (err instanceof TypeError) {
      window.scroll(top, left);
    } else {
      throw err;
    }
  }
}

export const reduceToObjectProps = (array, defaultValue = false) => 
  array.reduce((reduced, item) => ({
    ...reduced,
    [item]: defaultValue
  }), {});