export { applyCss as applyCss } from '../helpers';

export const debounce = (delay = 250) => {
  let timeout: any;

  return (callback: Function) => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
    
    return timeout;
  }
}

export const round = (value: number, scale = 10) => Math.round(value * scale) / scale;

export const parsePercent = (number: number) => {
  if (number < 0) {
    return 0;
  }
  if (number > 100) {
    return 100;
  }
  return number;
}

export const getTs = () => Math.floor(Date.now() / 1000); 

export const filterUnique = (
  value: string | number | boolean,
  index: number,
  self: []
) => self.indexOf(value) === index;


interface scrollToProps {
  top: number
  left: number
  behavior?: 'smooth' | 'auto'
}
export const scrollTo = ({
  top = 0,
  left = 0,
  behavior = 'smooth'
}: scrollToProps) => {
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

interface RecordWithId<T> { id: T }
export const filterByUniqueId = <T extends RecordWithId<T>>(
  record: T,
  index: number,
  self: RecordWithId<T['id']>[]
) => {
  const foundIndex = self.findIndex(anyRecord => anyRecord.id == record.id);
  return foundIndex === index;
}

export const filterTruthyProp = <T>([prop, val]: T) => val ? prop : [];

export const filterTruthyEntry = <T>(object: T) => Object
  .entries(object)
  .flatMap(filterTruthyProp);
