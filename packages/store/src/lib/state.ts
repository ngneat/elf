type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type Merge<State extends any[], Key extends PropertyKey> = UnionToIntersection<
  State[number][Key]
>;

export type PropsFactory<Props, Config> = { props: Props; config: Config };
export type EmptyConfig = Record<string, any>;

export function createState<S extends PropsFactory<any, any>[]>(
  ...propsFactories: S
): { state: Merge<S, 'props'>; config: Merge<S, 'config'> } {
  return propsFactories.reduce(
    (acc, current) => {
      acc.config = {
        ...(acc.config as Record<any, any>),
        ...current.config,
      };

      acc.state = {
        ...(acc.state as Record<any, any>),
        ...current.props,
      };

      return acc;
    },
    { config: {}, state: {} } as {
      state: Merge<S, 'props'>;
      config: Merge<S, 'config'>;
    }
  );
}
