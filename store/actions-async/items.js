import 'isomorphic-unfetch';
import { getUrl } from '../../helpers';
import {
  loadWeapons
} from '../actions/items';

export const getWeaponsAsync = () => async dispatch => {
  const data = await fetch(getUrl('/items/weapons'));
  const weapons = await data.json();

  dispatch(loadWeapons(weapons));
  return weapons;
}

export const getWeaponAsync = slug => async dispatch => {
  const data = await fetch(getUrl(`/items/weapons/${slug}`));
  const weapon = await data.json();

  dispatch(loadWeapons([weapon]));
  return weapon;
}