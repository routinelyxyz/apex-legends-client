import { createSelector } from "reselect";
import { filterUnique } from '../../util';

export const initialState = {
  name: '',
  sortBy: 'name',
  sortAsc: true,
  selectedCategories: {},
  selectedAmmoTypes: {},
  static: {
    ammoTypes: [],
    categories: [],
    items: []
  }
}

export function weaponFiltersReducer(
  state = initialState,
  action
) {
  switch(action.type) {
    case 'LOAD_ITEMS': {
      const items = action.payload;
      const ammoTypes = items
        .map(item => item.ammo)
        .filter((ammoType, index, self) => self.indexOf(ammoType.name) === index);
      const categories = items
        .map(item => item.type)
        .filter(filterUnique)
        .sort();

      return {
        ...initialState,
        selectedCategories: categories
          .reduce((selected, category) => ({
            ...selected,
            [category]: false
          }), {}),
        selectedAmmoTypes: ammoTypes
          .reduce((selected, ammoType) => ({
            ...selected,
            [ammoType.name]: ammoType.name
          }), {}),
        static: {
          ammoTypes,
          categories,
          items
        }
      }
    }
    case 'UPDATE_NAME': return { ...state, name: action.payload }
    case 'TOGGLE_ORDER': return { ...state, sortAsc: !state.sortAsc }
    case 'UPDATE_SORT_BY': return { ...state, sortBy: action.payload }
    case 'TOGGLE_CATEGORY': return {
      ...state,
      selectedCategories: {
        ...state.selectedCategories,
        [action.payload]: !state.selectedCategories[action.payload]
      }
    }
    case 'TOGGLE_AMMO_TYPE': return {
      ...state,
      selectedAmmoTypes: {
        ...state.selectedAmmoTypes,
        [action.payload]: !state.selectedAmmoTypes[action.payload]
      }
    }
    case 'CLEAR_FILTERS': return {
      ...initialState,
      selectedAmmoTypes: Object.fromEntries(
        Object
          .entries(state.selectedAmmoTypes)
          .map(([prop]) => [prop, false])
      ),
      selectedCategories: Object.fromEntries(
        Object
          .entries(state.selectedCategories)
          .map(([prop]) => [prop, false])
      ),
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


export const _filteredWeapons = (state) => {
  const selectedCategoryNames = Object.keys(state.categories);
  const selectedAmmoTypeNames = Object.keys(state.ammoTypes);

  return state.static.items
    .filter(item =>
      item.name.toLowerCase().includes(state.name.toLowerCase())
    )
    .filter(item => selectedCategoryNames.length
      ? state.selectedCategories[item.type]
      : true
    )
    .filter(item => selectedAmmoTypeNames.length
      ? state.selectedAmmoTypes[item.ammo.name]  
      : true
    )
    .sort((a, b) => {
      const sortDir = state.sortAsc ? 1 : -1;
      
      if (state.sortBy === 'name') {
        return (a[sortProp] > b[sortProp] ? 1 : -1) * sortDir;
      }
      if (state.sortBy === 'ammoType') {
        const indexA = ammoTypeNames.indexOf(a.ammo.name);
        const indexB = ammoTypeNames.indexOf(b.ammo.name);

        return (indexA > indexB ? 1 : -1) * sortDir;
      }
      return (a[sortProp] - b[sortProp]) * sortDir;
    });
}
