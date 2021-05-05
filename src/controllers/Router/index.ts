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
    if (href === location.href) return;
    const [url, params] = href.split('?');

    history.pushState(null, '', url);
    this.renderPath();
  }

  public path(path: string, cb: Function): void {
    this.routes.push({ path, view: cb });
  }

  public renderPath(): void {
    const getCurrentPath = (acc: {}, route: Route) =>
      route.path === location.pathname ? ((acc = route), acc) : acc;

    const route: Partial<Route> = this.routes.reduce(getCurrentPath, {});
    const { rootElement } = this;

    rootElement.innerHTML = '';

    const hasViewPage = 'view' in route;
    if (hasViewPage) {
      rootElement.insertAdjacentElement(
        'beforeend',
        new route.view(this.context).render()
      );

      return;
    }

    const $PageNotFound = new NotFound().render();
    rootElement.insertAdjacentElement('beforeend', $PageNotFound);
  }
}
