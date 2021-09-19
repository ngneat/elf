type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type Merge<State extends any[], Key extends PropertyKey> = UnionToIntersection<
  State[number][Key]
>;

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
