
const initialState = {
  isLoading: true,
  phrase: '',
  sortBy: 'name',
  sortAsc: true,
  ammoTypes: [],
  categories: []
}

export function weaponsReducer(state, action) {
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
      )
    }
    default: return state;
  }
}

export function initWeaponsReducer(items) {
  const ammoTypes = items
    .flatMap((item, index, self) => {
      const foundIndex = self.findIndex(anyItem => 
        anyItem.ammo.name === item.ammo.name
      );
      if (foundIndex === index) {
        return { ...item, selected: false };
      }
      return [];
    });

  const categories = items
    .flatMap((item, index, self) => {
      const foundIndex = self.findIndex(anyItem =>
        anyItem.type === item.type
      );
      if (foundIndex === index) {
        return { ...item, selected: false };
      }
      return [];
    })
    .sort((a, b) => a.name > b.name ? 1 : -1);

  return {
    ...initialState,
    ammoTypes,
    categories,
    items
  }
}


export const weaponsFilter = (state) => {
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
  }
}
