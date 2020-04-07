export const getServerGlobal = (key: string): string => ((global as any).__SERVER_CONTEXT || {})[key];
