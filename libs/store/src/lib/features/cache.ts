import {stateFactory} from "@ngneat/elf";
import {CacheState} from "../core/types";

export const {
  withCache,
  resetCache,
  selectCache,
  setCache
} = stateFactory<{ cache: CacheState }>('cache', 'none');
