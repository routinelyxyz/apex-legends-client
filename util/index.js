export { applyCss as applyCss } from '../helpers';

export const debounce = (delay = 250, timeout) => fn => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
  return timeout;
}

export const round = (val, scale = 10) => Math.round(val * scale) / scale;

export const parsePercent = (number) => {
  if (number < 0) {
    return 0;
  }
  if (number > 100) {
    return 100;
  }
  return number;
}

export const useDebounce = (delay = 250, timeout) => [
  fn => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  },
  timeout
];

export const getTs = () => Math.floor(Date.now() / 1000); 

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

export const filterByUniqueId = (record, index, self) => {
  const foundIndex = self.findIndex(anyRecord => anyRecord.id == record.id);
  return foundIndex === index;
}

export const filterTruthyProp = ([prop, val]) => val ? prop : [];

export const filterTruthyEntry = (object) => Object
  .entries(object)
  .flatMap(filterTruthyProp);
