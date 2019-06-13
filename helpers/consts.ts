
type NodeEnv = 'development' | 'test' | 'production';

export const NODE_ENV = <NodeEnv>process.env.NODE_ENV || 'development';