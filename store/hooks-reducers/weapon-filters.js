
/* Map props / values */
const parse = (data, prop) => data
  .reduce((parsed, item) => {
    const propName = typeof prop === 'function' ? prop(item) : item[prop];
    return {
      ...parsed,
      [propName]: false
    }
  }, {});

export const initialState = {
  name: '',
  sortBy: 'name',
  sortAsc: true,
  categories: {},
  ammoTypes: {}
}

function reducer(state = initialState, action) {
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
    case 'TOGGLE_CATEGORY': return {
      ...state,
      categories: {
        ...state.categories,
        [action.payload]: !state.categories[action.payload]
      }
    }
    case 'TOGGLE_AMMO_TYPE': return {
      ...state,
      ammoTypes: {
        ...state.ammoTypes,
        [action.payload]: !state.ammoTypes[action.payload]
      }
    }
    case 'CLEAR_FILTERS': return initialState;
    default: return state;
  }
}

export default reducer;