import NotFound from './routes/404';

export default class Render {
  constructor(
    private routeFallback: () => HTMLElement[],
    private rootElement: HTMLElement,
    private ctx: any
  ) {
    this.renderRoute = this.renderRoute.bind(this);
  }

  public static createRender(rootElement: HTMLElement, ctx: any): Render {
    const routeFallback = () => new NotFound().render();
    return new Render(routeFallback, rootElement, ctx);
  }

  public renderElements(content: HTMLElement[]): void {
    this.rootElement.innerHTML = '';
    content.forEach(el => this.rootElement.appendChild(el));
  }

  public renderRoute(
    view: (ctx: any) => HTMLElement[] = this.routeFallback
  ): void {
    this.renderElements(view(this.ctx));
  }
}
