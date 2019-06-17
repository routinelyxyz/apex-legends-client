import * as consts from './consts';
import { PlayerBase } from '../types';
export { applyCss as applyCss } from '../util';

export const platforms = [
  { name: 'All', value: 'all' },
  { name: 'PC', value: 'pc' },
  { name: 'PS4', value: 'ps4' },
  { name: 'Xbox', value: 'xbox' }
];

export const platformNames = {
  all: 'All',
  pc: 'PC',
  ps4: 'PS4',
  xbox: 'Xbox'
}

export const weaponPropTitles = {
  bodyDamage: 'Body damage',
  headshotDamage: 'Headshot damage',
  bodyDPS: 'Body DPS',
  headshotDPS: 'Headshot DPS',
  reloadTime: 'Reload time',
  emptyReload: 'Reload time (empty mag)',
  magazine: 'Magazine size'
}

export const weaponPropsArr = [
  {
    prop: 'bodyDamage',
    title: weaponPropTitles.bodyDamage
  },
  {
    prop: 'headshotDamage',
    title: weaponPropTitles.bodyDamage
  },
  {
    prop: 'bodyDPS',
    title: weaponPropTitles.bodyDPS
  },
  {
    prop: 'reloadTime',
    title: weaponPropTitles.reloadTime,
    parser: (v: string) => parseFloat(v) + ' s'
  },
  {
    prop: 'emptyReload',
    title: weaponPropTitles.emptyReload,
    parser: (v: string) => parseFloat(v) + ' s'
  },
  {
    prop: 'magazine',
    title: weaponPropTitles.magazine
  }
];

export const ammoNames = {
  Light: 'Light bullets'
}

export const statsProps = {
  lifetime: ['kills', 'damage', 'headshots', 'lvl'],
  legend: ['kills', 'damage', 'headshots', 'damagePerKill', 'headshotsPerKill']
}

export const statsTitlesMap = {
  kills: 'Kills',
  damage: 'Damage',
  headshots: 'Headshots',
  matches: 'Matches',
  damagePerKill: 'Damage / Kill',
  headshotsPerKill: 'Headshots / Kill',
  lvl: 'Level'
}

export const getStatic = (url: string) => consts.STATIC + url;
export const getUrl = (url: string) => consts.HOST_URL + url;
export const getAvatar = (player: PlayerBase, size = 115) => getStatic(
  `/avatars/${player.avatar ? player.id : 'default'}-${size}.jpg`
);