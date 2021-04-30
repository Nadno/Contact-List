export interface IRouter {
  path(path: string, cb: Function): void
  goTo(path: string): void;
}

export interface Route {
  path: string;
  view: any;
}

export type Routes = Array<Route>;
