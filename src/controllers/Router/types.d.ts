import { AppContext } from "../../App";
import { PageConstructor } from "../../views/routes/PageComponent";

export interface IRouter {
  path(path: string, view: any): void;
  goTo(path: string): void;
}

export interface Route {
  path: string;
  view: (ctx: AppContext) => Promise<PageConstructor>;
}
