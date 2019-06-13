import Axios from "axios";
import { Player, Stats, MatchHistoryRecord, Platform } from "../../types";

function getStatsUrl(player: Player) {
  const { platform, name, id = '' } = player;
  return `/stats/v2/${platform}/${encodeURIComponent(name)}?id=${id}`;
}

export async function fetchStats(
  player: Player
): Promise<Stats | null> {
  const response = await Axios.get(getStatsUrl(player));
  return response.data.data;
}

export async function updateStats(
  player: Player
): Promise<MatchHistoryRecord | null> {
  const response = await Axios.post(getStatsUrl(player));
  return response.data.latestMatch;
}

export async function fetchInitialStats(queryParams: any) {
  const { platform, name, id } = queryParams;
  try {
    const stats = await fetchStats(queryParams);
    return {
      stats,
      platform,
      name,
      error: false,
      skipFirstFetch: false
    }
  } catch(err) {
    const { status } = err.response;

    if (status === 404) {
      try {
        await updateStats(queryParams);
        const stats = await fetchStats(queryParams);
        return {
          stats,
          platform,
          name,
          error: false,
          skipFirstFetch: true
        }
      } catch(err) {
        const { status } = err.response;
        return {
          stats: null,
          platform,
          name,
          status,
          error: true,
          skipFirstFetch: false
        }
      }
    }
  }
}

export interface FetchInitialStatsResult {
  stats: Stats | null
  platform: Platform
  name: string
  status?: number
  error: boolean
  skipFirstFetch: boolean
}