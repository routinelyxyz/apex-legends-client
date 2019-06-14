import { Environment } from "../types";

export const NODE_ENV = <Environment>process.env.NODE_ENV || 'development';