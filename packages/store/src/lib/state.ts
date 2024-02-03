export type Merge<
  State extends Record<Key, any>[],
  Key extends PropertyKey,
> = State extends [Record<Key, infer V>, ...infer Rest extends any[]]
  ? V & Merge<Rest, Key>
  : unknown;

export type PropsFactory<Props, Config> = { props: Props; config: Config };
export type EmptyConfig = undefined;

export function createState<S extends PropsFactory<any, any>[]>(
  ...propsFactories: S
): { state: Merge<S, 'props'>; config: Merge<S, 'config'> } {
  const result = { config: {}, state: {} };

  for (const { config, props } of propsFactories) {
    Object.assign(result.config, config);
    Object.assign(result.state, props);
  }

  return result as { state: Merge<S, 'props'>; config: Merge<S, 'config'> };
}
