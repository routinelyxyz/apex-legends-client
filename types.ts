
export type Platform = 'pc' | 'ps4' | 'xbox';

export interface Player {
  id: number
  name: string
  avatar: boolean
  avatarUrl: string
  platform: Platform
}

export type StatsValue = number | null;

export type StatsData = {
  rank: number
  percentile: number
  value: StatsValue
}

export interface LifetimeStats {
  id: number
  season: number
  lvl: StatsData
  lvlProgress: StatsData
  kills: StatsData
  damage: StatsData
  headshots: StatsData
  damagePerKill: StatsData
  headshotsPerKill: StatsData
}

export interface Legend {
  id: number
  name: string
  slug: string
  img: string
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
  // 
  day: string
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