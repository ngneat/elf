import { EmptyConfig, State } from '../core/state';

export type CacheState = {
  $cache: 'none' | 'partial' | 'full';
}

export function withCache(): State<CacheState, EmptyConfig> {
  return {
    state: {
      $cache: 'none'
    },
    config: {}
  };
}
