import { AppContext } from '../../App';
import { IRouter, Route } from './types';
import { IObserver } from '../Observer/types';

export default class Router implements IRouter {
  private routes: Array<Route> = [];

  constructor(private location: Location, private emitter: IObserver) {
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
    const getParam = (acc: Record<string, string>, param: string) => {
      const [key, value] = param.split('=');
      return (acc[key] = value), acc;
    };

    const [, params] = this.location.href.split('?');
    if (!params) return {};

    return params.split('&').reduce(getParam, {});
  }

  public goTo(href: string): void {
    if (href === this.location.href) return;

    history.pushState(null, '', href);
    this.renderPath();
  }

  public path(path: string, view: (ctx: AppContext) => HTMLElement[]): void {
    this.routes.push({ path, view });
  }

  public renderPath(): void {
    const getCurrentPath = (acc: {}, route: Route) =>
      route.path === this.location.pathname ? ((acc = route), acc) : acc;

    const route: Partial<Route> = this.routes.reduce(getCurrentPath, {});
    this.emitter.emit('renderRoute', route.view);
  }
}
