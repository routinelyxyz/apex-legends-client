import * as consts from './consts';
export * from './consts';

export const platforms = [
  { name: 'All', value: 'all' },
  { name: 'PC', value: 'pc' },
  { name: 'PS4', value: 'ps4' },
  { name: 'Xbox', value: 'xbox' }
]

export const platformNames = {
  all: 'All',
  pc: 'PC',
  ps4: 'PS4',
  xbox: 'Xbox'
}

export const weaponProps = [
  ['bodyDamage', 'Body damage'],
  ['headshotDamage', 'Headshot damage'],
  ['bodyDPS', 'Body DPS'],
  ['reload', 'Reload time',  v => parseFloat(v) + ' s'],
  ['emptyReload', 'Reload time (empty magazine)', v => parseFloat(v) + ' s'],
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
  lvl: 'Level',
}


export const applyCss = (...inputs) => ({
  className: inputs
    .filter(input => 
      typeof input === 'string' && input.length
    )
    .join(' ')
});

export const getStatic = url => consts.STATIC + url;
export const getUrl = url => consts.HOST_URL + url;
export const getAvatar = (player, size = 115) => getStatic(
  `/avatars/${player.avatar ? player.id : 'default'}-${size}.jpg`
);