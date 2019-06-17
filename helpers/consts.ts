import { Environment } from "../types";

export const NODE_ENV = <Environment>process.env.NODE_ENV || 'development';

export const GA_ID = 'UA-136317731-1';

export const HOST_URL = NODE_ENV === 'production'
  ? 'https://api.apex-legends.win'
  : 'http://localhost:4000';

export const STATIC = NODE_ENV === 'production'
  ? 'https://static.apex-legends.win'
  : 'http://static.localhost';

export const isServer = typeof window === 'undefined';