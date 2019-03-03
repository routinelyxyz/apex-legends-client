
export const weaponProps = [
  ['bodyDamage', 'Body damage'],
  ['headshotDamage', 'Headshot damage'],
  ['bodyDPS', 'Body DPS'],
  ['headshotDPS', 'Headshot DPS'],
  ['reload', 'Reload time'],
  ['emptyReload', 'Empty reload time'],
  ['magazine', 'Magazine size'],
];

export const weaponPropTitles = {
  bodyDamage: 'Body damage',
  headshotDamage: 'Headshot damage',
  bodyDPS: 'Body DPS',
  headshotDPS: 'Headshot DPS',
  reload: 'Reload time',
  emptyReload: 'Reload time (empty mag)',
  magazine: 'Magazine size'
}

export const ammoNames = {
  Light: 'Light bullets'
}

export const statsPropTitles = {
  damagePerKill: 'Damage / Kill',
  headshotsPerKill: 'Headshots / Kill'
}

export const HOST_URL = 'http://localhost:4000';
export const STATIC = HOST_URL + '/static';

export const getStatic = url => HOST_URL + '/static' + url;
export const getUrl = url => HOST_URL + url;