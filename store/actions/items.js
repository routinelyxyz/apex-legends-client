import {
  LOAD_WEAPONS, UPDATE_WEAPON
} from '../action-types';

export const loadWeapons = payload => ({
  type: LOAD_WEAPONS,
  payload
});

export const updateWeapon = (slug, payload) => ({
  type: UPDATE_WEAPON,
  payload,
  meta: { slug }
});