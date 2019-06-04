import { createSelector } from "reselect";

const normalizeToObject = (data, prop) => data
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
  ammoTypes: {},
  static: {
    ammoTypes: [],
    categories: [],
    weapons: []
  }
}

export function weaponFiltersReducer(
  state = initialState,
  action
) {
  switch(action.type) {
    case 'LOAD_DATA': {
      const { items } = action.payload;
      return {
        ...state,
        categories: normalizeToObject(items, 'type'),
        ammoTypes: normalizeToObject(items, i => i.ammo.name)
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
    case 'CLEAR_FILTERS': return {
      ...initialState,
      static: state.static
    }
    default: return state;
  }
}

export const weaponFilters = state => state;

export const selectedCategoryNames = state => Object.keys(state.categories);
export const selectedAmmoTypeNames = state => Object.keys(state.ammoTypes);

export const filteredWeapons = createSelector(
  weapons,
  weaponFilters,
  selectedCategoryNames,
  selectedAmmoTypeNames,
  (weapons, filters, selectedCategoryNames, selectedAmmoTypeNames) => weapons
    .filter(item =>
      item.name.toLowerCase().includes(filters.name.toLowerCase())
    )
    .filter(item => selectedCategoryNames.length
      ? filters.categories[item.type]
      : true
    )
    .filter(item => selectedAmmoTypeNames.length
      ? selectedAmmoTypeNames[item.ammo.name]  
      : true
    )
    .sort((a, b) => {
      const { categories, ammoTypes } = filters;
      const sortDir = sortAsc ? 1 : -1;

      if (sortProp === 'name') {
        return (a[sortProp] > b[sortProp] ? 1 : -1) * sortDir;
      }
      if (sortProp === 'ammoType') {
        const indexA = ammoTypeNames.indexOf(a.ammo.name);
        const indexB = ammoTypeNames.indexOf(b.ammo.name);

        return (indexA > indexB ? 1 : -1) * sortDir;
      }
      return (a[sortProp] - b[sortProp]) * sortDir;
    })

);