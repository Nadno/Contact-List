import NotFound from '../../views/routes/404';

import { IRouter, Route, Routes } from './types';
import { AppContext } from '../../App';

export default class Router implements IRouter {
  private routes: Routes = [];

  private context: AppContext;

  constructor(private rootElement: HTMLElement, ctx: AppContext) {
    this.context = ctx;
    this.rootElement.addEventListener('click', this.handleLinkClick.bind(this));
  }

  public handleLinkClick(e: Event) {
    const target = e.target as HTMLAnchorElement;

    if (target.matches('[data-link]')) {
      e.preventDefault();
      this.goTo(target.href);
    }
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
