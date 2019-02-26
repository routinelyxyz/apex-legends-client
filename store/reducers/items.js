import {
  LOAD_WEAPONS, UPDATE_WEAPON
} from '../action-types';

const initialState = {
  weapons: {},
  attachments: {}
}

const itemsReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_WEAPONS: {
      const weapons = action.payload
        .reduce((normalized, weapon) => ({
          ...normalized,
          [weapon.slug]: weapon
        }), state.weapons);

      return { ...state, weapons }
    }
    case UPDATE_WEAPON: {
      const { payload, meta: { slug }} = action;
      const { [slug]: weapon } = state.weapons;
      return {
        ...state,
        weapons: {
          ...state.weapons,
          [slug]: { ...weapon, ...payload }
        }
      }
    }
    default: return state;
  }
}

export default itemsReducer;