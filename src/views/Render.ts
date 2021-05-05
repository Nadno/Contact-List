import { AppContext } from '../App';
import NotFound from './routes/404';

export default class Render {
  constructor(
    private routeFallback: () => HTMLElement[],
    private rootElement: HTMLElement,
    private ctx: AppContext
  ) {
    this.renderRoute = this.renderRoute.bind(this);
  }

  public static createRender(
    rootElement: HTMLElement,
    ctx: AppContext
  ): Render {
    const routeFallback = () => new NotFound().render();
    return new Render(routeFallback, rootElement, ctx);
  }

  public renderElements(content: HTMLElement[]): void {
    this.rootElement.innerHTML = '';
    content.forEach(el => this.rootElement.appendChild(el));
  }

  public renderRoute(
    view: (ctx: AppContext) => HTMLElement[] = this.routeFallback
  ): void {
    this.renderElements(view(this.ctx));
  }
}
