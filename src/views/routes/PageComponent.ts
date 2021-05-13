import { AppContext } from '../../App';
import Component from '../component';

interface PageComponent extends Component<HTMLElement[]> {
  unMount?(): void;
}

export interface PageConstructor extends PageComponent {
  new (ctx: AppContext): PageComponent;
}

abstract class PageComponent extends Component<HTMLElement[]> {
  public setTitle(title: string): void {
    document.title = title;
  }
}

export default PageComponent;
