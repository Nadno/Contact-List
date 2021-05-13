import PageComponent from '../../views/routes/PageComponent';

import { AppContext } from '../../App';
import { IRouter, Route } from './types';
import { IEmitter } from '../Emitter/types';

export default class Router implements IRouter {
  private routes: Array<Route> = [];

  constructor(private location: Location, private emitter: IEmitter) {
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  public handleLinkClick(e: Event) {
    const target = e.target as HTMLAnchorElement;

    if (target.matches('[data-link]')) {
      e.preventDefault();
      this.goTo(target.href);
    }
  }

  public getParams(): Record<string, string> {
    let result: Record<string, string> = {};

    const [, params] = this.location.href.split('?');
    if (!params) return result;

    const getParam = (value: string, key: string) => {
      result[key] = value;
    };

    const searchParams = new URLSearchParams(params);
    searchParams.forEach(getParam);

    return result;
  }

  public goTo(href: string): void {
    if (href === this.location.href) return;

    history.pushState(null, '', href);
    this.renderPath();
  }

  public goBack(): void {
    history.back();
  }

  public path(path: string, view: (ctx: AppContext) => PageComponent): void {
    this.routes.push({ path, view });
  }

  public renderPath(): void {
    const getCurrentPath = (acc: {}, route: Route) =>
      route.path === this.location.pathname ? ((acc = route), acc) : acc;

    const route: Partial<Route> = this.routes.reduce(getCurrentPath, {});
    this.emitter.emit('renderRoute', route.view);
  }
}
