import { PlayerBase, LegendBase, LegendStats, LifetimeStats, Weapons, WeaponProps, Weapon, LegendDetailed } from ".";

export interface Api {
  '/stats/v2/daily-ranking': {
    kills: number | null
    headshots: number | null
    damage: number | null
    matchesPlayed: number | null
    player: PlayerBase
  }[]
  '/stats/v2/recently-updated': {
    id: number
    kills: number | null
    damage: number | null
    headshots: number | null
    damagePerKill: number | null
    headshotsPerKill: number | null
    date: string
    player: PlayerBase
    legend: LegendBase
  }[]
  '/stats/v2/match-history/id/:playerId': {
    id: number
    date: string
    season: number
    kills: number | null
    damage: number | null
    headshots: number | null
    damagePerKill: number | null
    headshotsPerKill: number | null
    legend: LegendBase
  }[]
  '/stats/v2/:platform/:name': {
    player: PlayerBase
    lifetime: LifetimeStats
    legends: LegendStats[]
  } | null
  '/stats/leaderboards': {
    page: number
    pages: number
    data: {
      id: number
      kills: number
      player: PlayerBase
      // [key in LifetimeStatsDataProps | LegendStatsDataProps]: number | null
      [key: string]: any
    }[]
  }
  '/items/weapons': Weapons
  '/items/weapon/:slug': Weapon
  '/items/weapons/ratio': {
    name: WeaponProps 
    min: number
    diff: number
    max: number
  }[]
  '/legends': LegendBase[]
  '/legends/:slug': LegendDetailed
}