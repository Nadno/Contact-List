import Component from '../../component';
import PageComponent from '../PageComponent';
import Contacts from '../../Contact/Contacts';
import Header from '../../Header';

import { AppContext } from '../../../App';

import '../../../../public/styles/views/home.scss';

export default class Home extends PageComponent {
  $elements: HTMLElement[];

  constructor(ctx: AppContext) {
    super();
    this.setTitle('Lista de contatos');

    const $header = new Header().render();
    const $contactList = new Contacts(ctx).render();

    this.$elements = [$header, $contactList];
  }

  public render(): HTMLElement[] {
    return this.$elements;
  }
}
