import Component from '../../component';
import PageComponent from '../PageComponent';
import Contacts from '../../Contact/Contacts';

import { AppContext } from '../../../App';

import '../../../../public/styles/views/home.scss';

export default class Home extends PageComponent {
  $element: Component;

  constructor(ctx: AppContext) {
    super();
    this.setTitle('Contacts');
    this.$element = new Contacts(ctx);
  }

  public render(): HTMLElement {
    return this.$element.render();
  }
}
