
export const initialState = {
  name: '',
  sortBy: 'name',
  sortAsc: true,
  categories: {},
  ammoTypes: {}
}

/* Map props / values */
const parse = (data, prop) => data
  .reduce((parsed, item) => {
    const propName = typeof prop === 'function' ? prop(item) : item[prop];
    return {
      ...parsed,
      [propName]: false
    }
  }, {});


const toggler = (state, action, prop) => {
  const { payload: key } = action;
  const { [key]: prevStatus, ...items } = state[prop];
  return {
    ...state,
    [prop]: {
      ...items,
      [key]: !prevStatus
    }
  }
}


export function reducer(state, action) {
  switch(action.type) {
    case 'LOAD_DATA': {
      const { items } = action.payload;

      return {
        ...state,
        categories: parse(items, 'type'),
        ammoTypes: parse(items, i => i.ammo.name)
      }
    }
    case 'UPDATE_NAME': return { ...state, name: action.payload }
    case 'TOGGLE_ORDER': return { ...state, sortAsc: !state.sortAsc }
    case 'UPDATE_SORT_BY': return { ...state, sortBy: action.payload }
    /* It will change categories order */
    case 'TOGGLE_CATEGORY': {
      const { payload } = action;
      const { [payload]: category, ...categories } = state.categories;
      return {
        ...state,
        categories: {
          [payload]: !category,
          ...categories
        }
      }
    }
    case 'TOGGLE_AMMO_TYPE': return toggler(state, action, 'ammoTypes');
    default: throw new Error(`Action with type ${action.type} doesn't exist`);
  }
}