import Link from '../controllers/Link';
import Component from './component';

import { AppContext } from '../App';
import { IObserver } from '../controllers/Observer/types';
import { ILinkedList } from '../models/LinkedList/types';
import { ContactAndPosition } from '../models/ContactList/types';

import Contacts from './Contact/Contacts';

export default class Header extends Component {
  private $header: HTMLElement;

  private emitter: IObserver;
  private scheduledSearch: NodeJS.Timeout | null = null;

  public contactsResult: Contacts;

  constructor({ emitter }: AppContext) {
    super();

    this.emitter = emitter;
    this.handleFindContact = this.handleFindContact.bind(this);

    const $searchContact = this.createSearchBar();

    const $addContact = Link({
      title: 'Criar contato',
      href: '/create',
      content: '+',
      class: 'header__add-contact',
    });

    this.$header = Component.createElement(
      'header',
      [$searchContact, $addContact],
      {
        class: 'header',
      }
    );

    this.contactsResult = new Contacts({
      class: 'contacts search-result',
      type: 'A',
    });
  }

  private createSearchBar(): HTMLElement {
    const $search = Component.createElement('input', '', {
      id: 'search',
      name: 'search',
      type: 'search',
      class: 'search',
      placeholder: 'Encontrar contato',
    });

    const $submit = Component.createElement('button', 'buscar', {
      class: 'search__button',
      type: 'submit',
    });

    return Component.createElement('form', [$search, $submit], {
      class: 'search-bar',
    });
  }

  public render(): HTMLElement {
    return this.$header;
  }
}
