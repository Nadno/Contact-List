import Link from '../controllers/Link';
import Component from './component';

import { AppContext, AppState } from '../App';
import { ILinkedList } from '../models/LinkedList/types';
import { ContactAndPosition } from '../models/ContactList/types';

import Contacts from './Contact/Contacts';
import AsyncUtil from '../utils/AsyncUtil';

export default class Header extends Component {
  private $header: HTMLElement;

  public contactsResult: Contacts;
  public lastSearch: string = '';

  constructor(private ctx: AppContext<AppState>) {
    super();

    const $searchContact = this.createSearchBar();
    const $addContact = Link({
      title: 'Adicionar contato',
      href: '/create',
      content: '<i class="fas fa-user-plus"></i>',
      className: 'add-contact button icon-btn',
    });

    this.$header = Component.createElement(
      'header',
      [$searchContact, $addContact],
      {
        className: 'header',
      }
    );

    this.contactsResult = new Contacts(ctx, {
      className: 'contacts search-result',
      type: 'A',
      id: 'contact-result',
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

    const $toggleSearch = Component.createElement(
      'button',
      `
        <i class="fas fa-arrow-left close"></i>
        <i class="fas fa-search open"></i>
      `,
      {
        className: 'button icon-btn',
      }
    );

    const $searchBar = Component.createElement(
      'form',
      [$toggleSearch, $search],
      {
        className: 'search-bar',
      }
    );

    const { emitter } = this.ctx;

    const halfSecond = 500;
    const searchOnChange = AsyncUtil.debounce((e: Event) => {
      if (!this.$header.matches('.search-mode')) emitter.emit('toggleResult');
      this.searchOnChange(e);
    }, halfSecond);

    $search.addEventListener('input', searchOnChange);

    const ThreeHundredMS = 300;
    const limitToggleResultTrigger = AsyncUtil.throttle(() => {
      $search.value = '';
      emitter.emit('toggleResult');
    }, ThreeHundredMS);

    const handleToggleResult = (e: Event) => {
      e.preventDefault();
      limitToggleResultTrigger();
    };

    $toggleSearch.addEventListener('click', handleToggleResult);

    return $searchBar;
  }

  private handleContactsResult(results: ILinkedList<ContactAndPosition>): void {
    const { contactsResult } = this;
    contactsResult.clearList();

    const renderContact = (result: ContactAndPosition) =>
      contactsResult.addContact(result);

    results.forEach(renderContact);
  }

  private handleFindContact = (e: Event): void => {
    const { value } = e.target as HTMLInputElement;

    this.lastSearch = value;
    if (!value) return this.contactsResult.clearList();

    const { state } = this.ctx;
    this.handleContactsResult(state.contacts.findAll(value));
  };

  public updateResultList = (): void => {
    const { state } = this.ctx;

    const $resultList = document.getElementById(
      'contact-result'
    ) as HTMLOListElement;
    if (!$resultList.matches('.on')) return;

    this.handleContactsResult(state.contacts.findAll(this.lastSearch));
  };

  public render(): HTMLElement {
    return this.$header;
  }
}
