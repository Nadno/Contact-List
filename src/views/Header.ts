import Link from '../controllers/Link';
import Component from './component';

import { AppContext, AppState } from '../App';

import Contacts from './Contact/Contacts';
import SearchContact from './SearchContact';

export default class Header extends Component {
  public search: SearchContact;
  public lastSearch: string = '';
  public contactsResult: Contacts;

  private $header: HTMLElement;

  constructor(private ctx: AppContext<AppState>) {
    super();

    const $addContact = Link({
      title: 'Adicionar contato',
      href: '/create',
      content: '<i class="fas fa-user-plus"></i>',
      className: 'add-contact button icon-btn',
    });

    this.$header = Component.createElement('header', [$addContact], {
      className: 'header',
    });

    this.contactsResult = new Contacts(ctx, {
      className: 'contacts search-result',
      type: 'A',
      id: 'contact-result',
    });

    this.search = new SearchContact({
      contacts: ctx.state.contacts,
      resultList: this.contactsResult,
      toggleResult: () => ctx.emitter.emit('toggleResult'),
      isOnSearchMode: () => this.$header.matches('.search-mode'),
    });

    this.$header.insertAdjacentElement('afterbegin', this.search.render());
  }

  public render(): HTMLElement {
    return this.$header;
  }
}
