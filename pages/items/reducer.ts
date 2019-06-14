import { Weapon, AmmoType, WeaponType, Weapons, WeaponSortProp } from "../../types";

interface WeaponState {
  isLoading: boolean
  phrase: string
  sortBy: WeaponSortProp
  sortAsc: boolean
  ammoTypes: AmmoTypeState[]
  categories: {
    name: WeaponType
    selected: boolean
  }[]
  items: Weapon[]
}

export const initialState: WeaponState = {
  isLoading: true,
  phrase: '',
  sortBy: 'name',
  sortAsc: true,
  ammoTypes: [],
  categories: [],
  items: []
}

export function weaponsReducer(
  state: WeaponState,
  action: WeaponActions
): WeaponState {
  switch(action.type) {
    case 'UPDATE_PHRASE': return { ...state, phrase: action.payload }
    case 'TOGGLE_ORDER': return { ...state, sortAsc: !state.sortAsc }
    case 'UPDATE_SORT_BY': return { ...state, sortBy: action.payload }
    case 'TOGGLE_CATEGORY': return {
      ...state,
      categories: state.categories.map(category => {
        if (category.name === action.payload) {
          return { ...category, selected: !category.selected }
        }
        return category;
      })
    }
    case 'TOGGLE_AMMO_TYPE': return {
      ...state,
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
      categories: state.categories.map(category => 
        ({ ...category, selected: false })
      ),
      ammoTypes: state.ammoTypes.map(ammoType =>
        ({ ...ammoType, selected: false })
      ),
      items: state.items
    }
    default: return state;
  }
}

export function initWeaponsReducer(items: Weapons): WeaponState {

  const ammoTypes = items
    .flatMap((item, index, self) => {
      const foundIndex = self.findIndex(anyItem => 
        anyItem.ammo.name === item.ammo.name
      );
      if (foundIndex === index) {
        return [{ ...item.ammo, selected: false }];
      }
      return [];
    });

  const categories = items
    .flatMap((item, index, self) => {
      const foundIndex = self.findIndex(anyItem =>
        anyItem.type === item.type
      );
      if (foundIndex === index) {
        return [{ name: item.type, selected: false }];
      }
      return [];
    })
    .sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

  return {
    ...initialState,
    ammoTypes,
    categories,
    items
  }
}


export const weaponsFilter = (state: WeaponState) => {

  const selectedCategoryNames = state.categories.flatMap(category =>
    category.selected ? [category.name] : []
  );
  const selectedAmmoTypeNames = state.ammoTypes.flatMap(ammoType => 
    ammoType.selected ? [ammoType.name] : []    
  );

  const filteredWeapons = state.items
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
  }
}

interface UpdatePhrase {
  type: 'UPDATE_PHRASE'
  payload: string
}

interface ToggleOrder {
  type: 'TOGGLE_ORDER'
}

interface UpdateSortBy {
  type: 'UPDATE_SORT_BY'
  payload: WeaponSortProp
}

interface ToggleCategory {
  type: 'TOGGLE_CATEGORY'
  payload: string
}

interface ToggleAmmoType {
  type: 'TOGGLE_AMMO_TYPE'
  payload: string
}

interface LoadFilters {
  type: 'LOAD_FILTERS'
  payload: {
    phrase: string
    sortBy: WeaponSortProp
    sortAsc: boolean
    ammoTypeNames: string[]
    categoryNames: string[]
  }
}

interface ClearFilters {
  type: 'CLEAR_FILTERS'
}

type WeaponActions = 
  UpdatePhrase    |
  ToggleOrder     |
  UpdateSortBy    |
  ToggleCategory  |
  ToggleAmmoType  |
  LoadFilters     |
  ClearFilters;


interface AmmoTypeState extends AmmoType {
  selected: boolean
}