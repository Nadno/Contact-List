import { ContactAndPosition, IContactsList } from '../models/ContactList/types';
import { ILinkedList } from '../models/LinkedList/types';
import AsyncUtil from '../utils/AsyncUtil';
import Component from './component';
import Contacts from './Contact/Contacts';

interface SearchContactConstructor {
  contacts: IContactsList;
  resultList: Contacts;
  isOnSearchMode(): boolean;
  toggleResult(): any;
}

export default class SearchContact extends Component {
  private $element: HTMLElement;
  private contacts: IContactsList;
  private resultList: Contacts;
  private lastSearch = '';

  constructor({
    contacts,
    resultList,
    isOnSearchMode,
    toggleResult,
  }: SearchContactConstructor) {
    super();

    this.contacts = contacts;
    this.resultList = resultList;

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

    const halfSecond = 500;
    const ThreeHundredMS = 300;

    const handleSearchOnChange = AsyncUtil.debounce((e: Event) => {
      if (!isOnSearchMode()) toggleResult();
      this.searchOnChange(e);
    }, halfSecond);

    const limitToggleResultTrigger = AsyncUtil.throttle(() => {
      $search.value = '';
      toggleResult();
    }, ThreeHundredMS);

    const handleToggleResult = (e: Event) => {
      e.preventDefault();
      limitToggleResultTrigger();
    };

    $search.addEventListener('input', handleSearchOnChange);
    $toggleSearch.addEventListener('click', handleToggleResult);

    this.$element = $searchBar;
  }

  public updateResultList = (): void => {
    const $resultList = document.getElementById(
      'contact-result'
    ) as HTMLOListElement;

    if (!$resultList.matches('.on')) return;
    this.find(this.lastSearch);
  };

  private searchOnChange = (e: Event): void => {
    const { value } = e.target as HTMLInputElement;

    this.lastSearch = value;

    const isEmpty = !value;
    const hasNumber = RegExp(/[0-9]/g).test(value);
    if (isEmpty || hasNumber) return this.resultList.clearList();

    this.find(value);
  };

  public find(name: string) {
    this.handleContactsResult(this.contacts.findAll(name));
  }

  private handleContactsResult(results: ILinkedList<ContactAndPosition>): void {
    const { resultList } = this;
    resultList.clearList();

    const renderContact = (result: ContactAndPosition) =>
      resultList.addContact(result);

    results.forEach(renderContact);
  }

  public render(): HTMLElement {
    return this.$element;
  }
}
