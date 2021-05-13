import Component from '../component';

interface PageComponent {
  unMount?(): void;
}

abstract class PageComponent extends Component<HTMLElement[]> {
  public setTitle(title: string): void {
    document.title = title;
  }
}

export default PageComponent;
