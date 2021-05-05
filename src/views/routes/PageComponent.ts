import Component from '../component';

export default abstract class PageComponent extends Component<HTMLElement[]> {
  public setTitle(title: string): void {
    document.title = title;
  }
}
