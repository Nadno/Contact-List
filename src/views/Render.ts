import NotFound from './routes/404';
import PageComponent, { PageConstructor } from './routes/PageComponent';

export default class Render {
  protected currentPage: PageComponent;

  constructor(
    private routeFallback: () => PageComponent,
    private rootElement: HTMLElement,
    private ctx: any
  ) {
    this.currentPage = routeFallback();
    this.renderRoute = this.renderRoute.bind(this);
  }

  public static createRender(rootElement: HTMLElement, ctx: any): Render {
    const routeFallback = () => new NotFound();
    return new Render(routeFallback, rootElement, ctx);
  }

  public renderElements(content: HTMLElement[]): void {
    this.rootElement.innerHTML = '';
    content.forEach(el => this.rootElement.appendChild(el));
  }

  public async renderRoute(
    getView: () => Promise<PageConstructor>
  ): Promise<void> {
    if (this.currentPage.unMount) this.currentPage.unMount();

    try {
      const view = await getView();
      this.currentPage = new view(this.ctx);
    } catch (err) {
      this.currentPage = this.routeFallback();
    } finally {
      this.renderElements(this.currentPage.render());
    }
  }
}
