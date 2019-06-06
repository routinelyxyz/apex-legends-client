import { filterUnique } from '../../util';

export function initWeaponsReducer(items) {
  const items = action.payload;

  const ammoTypes = items
    .map(item => item.ammo)
    .filter((ammoType, index, self) => self.indexOf(ammoType.name) === index)
    .sort((a, b) => a.name > b.name ? 1 : -1);

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
        [ammoType.name]: false
      }), {}),
    static: {
      ammoTypes,
      categories,
      items
    }
  }
}

export const initialState = {
  phrase: '',
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

export function weaponsReducer(
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
    case 'UPDATE_PHRASE': return { ...state, phrase: action.payload }
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


export const weaponsFilter = (state) => {
  const selectedCategoryNames = Object.keys(state.categories);
  const selectedAmmoTypeNames = Object.keys(state.ammoTypes);
  const selectedCategoryEntries = Object.entries(state.selectedCategories);
  const selectedAmmoTypeEntries = Object.entries(state.selectedAmmoTypes);

  const filteredWeapons = state.static.items
    .filter(item =>
      item.name.toLowerCase().includes(state.phrase.toLowerCase())
    )
    .filter(item => selectedCategoryEntries.length
      ? state.selectedCategories[item.type]
      : true
    )
    .filter(item => selectedAmmoTypeEntries.length
      ? state.selectedAmmoTypes[item.ammo.name]  
      : true
    )
    .sort((a, b) => {
      const sortDir = state.sortAsc ? 1 : -1;
      const { sortBy, static: { ammoTypes }} = state;

      function calcDiff() {
        if (sortBy === 'name') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        }
        if (sortBy === 'ammoType') {
          const indexA = ammoTypes.findIndex(ammoType => ammoType.name === a.ammo.name);
          const indexB = ammoTypes.findIndex(ammoType => ammoType.name === b.ammo.name);
  
          return indexA > indexB ? 1 : -1;
        }

        return a[sortBy] - b[sortBy];
      }
      
      return calcDiff() * sortDir;
    });

  return {
    filteredWeapons,
    selectedCategoryNames,
    selectedAmmoTypeNames,
    selectedCategoryEntries,
    selectedAmmoTypeEntries
  }
}
