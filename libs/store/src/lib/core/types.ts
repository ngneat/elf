export type OrArray<T> = T[] | T;

export type CacheState = {
  $cache: 'none' | 'partial' | 'full';
};

export type StatusState = 'idle' | 'pending' | 'success' | 'error';
