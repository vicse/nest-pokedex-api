export interface IPokeResponse {
  count: number;
  next: string;
  previous: null;
  results: Array<Result>;
}

export interface Result {
  name: string;
  url: string;
}
