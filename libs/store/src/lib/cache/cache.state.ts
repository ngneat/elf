import { EmptyConfig, State } from '../core/state';

export type CacheState = {
  $cache: boolean;
}

export function withCache(): State<CacheState, EmptyConfig> {
  return {
    state: {
      $cache: false
    },
    config: {}
  };
}
