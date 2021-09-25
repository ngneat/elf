export type Movie = {
  id: number | string;
  title: string;
  genres: (string | number)[];
  actors: (string | number)[];
};

export interface FullMovie {
  id: number | string;
  title: string;
  genres: { id: number | string; name: string }[];
  actors: { id: number | string; name: string }[];
}
