import Link from '../controllers/Link';
import Component from './component';

import { AppContext } from '../App';
import { IEmitter } from '../controllers/Emitter/types';
import { ILinkedList } from '../models/LinkedList/types';
import { ContactAndPosition } from '../models/ContactList/types';

import Contacts from './Contact/Contacts';

export default class Header extends Component {
  private $header: HTMLElement;

  private emitter: IEmitter;
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
      className: 'header__add-contact',
    });

    this.$header = Component.createElement(
      'header',
      [$searchContact, $addContact],
      {
        className: 'header',
      }
    );

    this.contactsResult = new Contacts({
      className: 'contacts search-result',
      type: 'A',
    });
  }

  private createSearchBar(): HTMLElement {
    const $search = Component.createElement('input', '', {
      id: 'search',
      name: 'search',
      type: 'search',
      className: 'search',
      placeholder: 'Encontrar contato',
    });

    const $closeSearch = Component.createElement('button', 'X', {
      className: 'search__close',
    });

    const $searchBar = Component.createElement(
      'form',
      [$closeSearch, $search],
      {
        className: 'search-bar',
      }
    );

    $search.addEventListener('input', this.handleFindContact);

    const turnResultOn = () => this.emitter.emit('toggleResult', 'on');
    $search.addEventListener('focus', turnResultOn);

    const turnResultOff = (e: Event) => {
      e.preventDefault();
      $search.value = '';
      this.emitter.emit('toggleResult', 'off');
    };
    $closeSearch.addEventListener('click', turnResultOff);

    return $searchBar;
  }

  private scheduleSearch(query: string): void {
    if (this.scheduledSearch) clearTimeout(this.scheduledSearch);

    const handleResult = (results: ILinkedList<ContactAndPosition>) => {
      const { contactsResult } = this;
      contactsResult.clearList();

      const renderContact = (result: ContactAndPosition) =>
        contactsResult.addContact(result);

      results.forEach(renderContact);
    };

    const halfSecond = 500;
    const search = () => {
      this.emitter.emit('findContact', {
        handleResult,
        query,
      });
      this.scheduledSearch = null;
    };

    this.scheduledSearch = setTimeout(search, halfSecond);
  }

  private handleFindContact(e: Event): void {
    const { value } = e.target as HTMLInputElement;

    if (!value) return this.contactsResult.clearList();
    this.scheduleSearch(value);
  }

  public render(): HTMLElement {
    return this.$header;
  }
}
