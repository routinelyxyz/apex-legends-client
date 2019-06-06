import { filterUnique } from '../../util';

export const initialState = {
  isLoading: true,
  phrase: '',
  sortBy: 'name',
  sortAsc: true,
  ammoTypes: [],
  categories: [],
  selectedCategories: {},
  selectedAmmoTypes: {},
  static: {
    ammoTypes: [],
    categories: [],
    items: []
  }
}

export function weaponsReducer(state, action) {
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
      },
      categories: state.categories.map(category => {
        if (category.name === action.payload) {
          return { ...category, selected: !category.selected }
        }
        return category;
      })
    }
    case 'TOGGLE_AMMO_TYPE': return {
      ...state,
      selectedAmmoTypes: {
        ...state.selectedAmmoTypes,
        [action.payload]: !state.selectedAmmoTypes[action.payload]
      },
      ammoTypes: state.ammoTypes.map(ammoType => {
        if (ammoType.name === action.payload) {
          return { ...ammoType, selected: !ammoType.selected };
        }
        return ammoType;
      })
    }
    case 'LOAD_FILTERS': return {
      ...state,
      ...action.payload,
      isLoading: false,
      ammoTypes: state.ammoTypes.map(ammoType => {
        if (action.payload.ammoTypeNames.includes(ammoType.name)) {
          return { ...ammoType, selected: true }
        }
        return ammoType;
      }),
      categories: state.categories.map(category => {
        if (action.payload.categoryNames.includes(category.name)) {
          return { ...category, selected: true }
        }
        return category;
      })
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
      categories: state.categories.map(category => 
        ({ ...category, selected: false })
      ),
      ammoTypes: state.ammoTypes.map(ammoType =>
        ({ ...ammoType, selected: false })
      ),
      static: state.static
    }
    default: return state;
  }
}


export function initWeaponsReducer(items) {
  const ammoTypes = items
    .map(item => ({ ...item.ammo, selected: false }))
    .filter((ammoType, index, self) => self.indexOf(ammoType.name) === index)

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
    selectedAmmoTypesV2: ammoTypes
      .reduce((selected, ammoType) => ({
        ...selected,
        [ammoType.name]: {
          ...ammoType,
          selected: false
        }
      }), {}),
    ammoTypes,
    categories,
    static: {
      ammoTypes,
      categories,
      items
    }
  }
}


export const weaponsFilter = (state) => {
  const selectedCategoryEntries = Object.entries(state.selectedCategories);
  const selectedAmmoTypeEntries = Object.entries(state.selectedAmmoTypes);

  const selectedCategoryNames = state.categories.flatMap(category =>
    category.selected ? category.name : []
  );
  const selectedAmmoTypeNames = state.ammoTypes.flatMap(ammoType => 
    ammoType.selected ? ammoType.name : []    
  );

  const filteredWeapons = state.static.items
    .filter(item =>
      item.name.toLowerCase().includes(state.phrase.toLowerCase())
    )
    .filter(item => selectedCategoryNames.length
      ? selectedCategoryNames.includes(item.type)
      : true
    )
    .filter(item => selectedAmmoTypeNames.length
      ? selectedAmmoTypeNames.includes(item.ammo.name)  
      : true
    )
    .sort((a, b) => {
      const sortDir = state.sortAsc ? 1 : -1;
      const { sortBy, ammoTypes } = state;

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
