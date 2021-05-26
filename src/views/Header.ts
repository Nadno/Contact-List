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
      className: 'header__add-contact background-animation',
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

    const $closeSearch = Component.createElement(
      'button',
      '<i class="fas fa-arrow-left"></i>',
      {
        className: 'search__close ',
      }
    );

    const $searchBar = Component.createElement(
      'form',
      [$closeSearch, $search],
      {
        className: 'search-bar',
      }
    );

    const halfSecond = 500;
    $search.addEventListener(
      'input',
      AsyncUtil.debounce(this.handleFindContact, halfSecond)
    );

    const { emitter } = this.ctx;
    const turnResultOn = () => emitter.emit('toggleResult', 'on');
    $search.addEventListener('focus', turnResultOn);

    const turnResultOff = (e: Event) => {
      e.preventDefault();
      $search.value = '';
      emitter.emit('toggleResult', 'off');
    };
    $closeSearch.addEventListener('click', turnResultOff);

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
