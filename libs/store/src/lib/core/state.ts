type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type Merge<State extends any[], Key extends PropertyKey> = UnionToIntersection<
  State[number][Key]
>;

export type State<State, Config> = { state: State; config: Config };
export type EmptyConfig = Record<string, any>;

export function createState<State extends any[]>(
  ...state: State
): { state: Merge<State, 'state'>; config: Merge<State, 'config'> } {
  return state.reduce(
    (acc, current) => {
      acc.config = {
        ...acc.config,
        ...current.config,
      };

      acc.state = {
        ...acc.state,
        ...current.state,
      };

      return acc;
    },
    { config: {}, state: {} }
  );
}
