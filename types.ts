
export type Platform = 'pc' | 'ps4' | 'xbox';

export interface Player {
  id: number
  name: string
  avatar: boolean
  avatarUrl: string
  platform: Platform
}

export type StatsValue = number | null;

export type StatsData<T = StatsValue> = {
  rank: number
  percentile: number
  value: T
}

export interface LifetimeStats<T = StatsValue> {
  id: number
  season: number
  lvl: StatsData<T>
  lvlProgress: StatsData<T>
  kills: StatsData<T>
  damage: StatsData<T>
  headshots: StatsData<T>
  damagePerKill: StatsData<T>
  headshotsPerKill: StatsData<T>
}

export interface Legend {
  id: number
  name: string
  slug: string
  img: string
}

export { Legend as LegendBase }

export interface LegendDetailed extends Legend {
  title: string
  abilities: LegendAbility[]
}

export interface LegendStats {
  id: number
  season: number
  kills: StatsData
  damage: StatsData
  headshots: StatsData
  damagePerKill: StatsData
  headshotsPerKill: StatsData
  legend: Legend
}

export interface MatchHistoryRecord {
  id: number
  date: string
  season: number
  kills: StatsValue
  damage: StatsValue
  headshots: StatsValue
  damagePerKill: StatsValue
  headshotsPerKill: StatsValue
  legend: Legend
}

export type KeyedObject = {
  [key: string]: any
}

export type Stats = {
  player: Player
  lifetime: LifetimeStats
  legends: LegendStats[]
}

export type StatsPayload = {
  stats: Stats,
  latestMatch: MatchHistoryRecord | null
}

export type MatchHistory = MatchHistoryRecord[];

export type WeaponType = string;

export interface AmmoType {
  name: string
  img: string
}

export type WeaponProps = 'bodyDamage' | 'bodyDPS' | 'headshotDPS' | 'reloadTime' | 'emptyReload' | 'magazine';

type WeaponData = {
  [key in WeaponProps]: number
}

export interface Weapon extends WeaponData {
  id: number
  name: string
  slug: string
  type: WeaponType
  ammo: AmmoType
  img: string
  // bodyDamage: number
  // bodyDPS: number
  // headshotDPS: number
  // reloadTime: number
  // emptyReload: number
  // magazine: number
}

export type Weapons = Weapon[];

export type WeaponSortProp = 'name' | 'ammoType' | WeaponProps;

export interface LegendAbility {
  id: number
  name: string
  type: string
  description: string
  img?: string
}

export type Environment = 'development' | 'test' | 'production';

export interface TrendingStatsRecord {
  kills?: number
  damage?: number
  headshots?: number
  player: Player
}

export type TrendingStats = TrendingStatsRecord[];