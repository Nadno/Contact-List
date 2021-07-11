import Component from './component';
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

  public renderElements(content: HTMLElement[]): void {
    this.rootElement.innerHTML = '';
    content.forEach(el => this.rootElement.appendChild(el));
  }

  public async renderRoute(
    getView: () => Promise<PageConstructor>
  ): Promise<void> {
    if (this.currentPage.unMount) this.currentPage.unMount();
    if (!document.body.contains(this.rootElement))
      throw new Error(
        "It wasn't possible to render the view. The root element does not exist."
      );

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
