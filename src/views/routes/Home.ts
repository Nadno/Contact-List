import PageComponent from './PageComponent';
import Contacts from './../Contact/Contacts';
import Header from './../Header';

import { AppContext, AppState } from './../../App';

import { ILinkedList } from './../../models/LinkedList/types';
import { IContact } from './../../models/ContactList/types';

import '../../styles/views/home.scss';

interface UpdateContactList {
  letterKey?: string;
  removed?: Record<string, number[]>;
  added?: Record<string, number[]>;
}

export default class Home extends PageComponent {
  $elements: HTMLElement[];
  contactList: Contacts;

  constructor(private ctx: AppContext<AppState>) {
    super();
    this.setTitle('Lista de contatos');

    const header = new Header(ctx);
    ctx.emitter.on('updateResultList', header.updateResultList);

    const useNullElement = true;
    this.contactList = new Contacts(
      ctx,
      {
        className: 'contacts',
        type: 'A',
      },
      useNullElement
    );

    const $header = header.render();
    const $contactList = this.contactList.render();
    const $resultList = header.contactsResult.render();

    this.$elements = [$header, $contactList, $resultList];

    this.toggleResult = this.toggleResult.bind(this);
    this.renderContacts = this.renderContacts.bind(this);
  }

  public toggleResult(turn: 'on' | 'off') {
    const [$header, $contactList, $resultList] = this.$elements;
    const $searchBar = $header.querySelector('.search-bar');

    if ($searchBar) {
      const actions = { on: 'add', off: 'remove' };
      const toggle = actions[turn] as 'add' | 'remove';

      $searchBar.classList[toggle]('on');
      $resultList.classList[toggle]('on');
      $contactList.classList[toggle]('--hidden');

      if (turn === 'off') $resultList.innerHTML = '';
    }
  }

  private removeContactList(letterKey: string): void {
    try {
      const $list = document.getElementById(
        `letter-${letterKey}`
      ) as HTMLOListElement;
      const $listContainer = $list.closest('.contact-list') as HTMLLIElement;

      $listContainer.remove();
    } catch (err) {
      console.log(err);
    }
  }

  private renderContacts(
    contacts: ILinkedList<IContact>,
    letterKey: string,
    sorted: boolean = false
  ): void {
    try {
      const $contactList =
        (document.getElementById(`letter-${letterKey}`) as HTMLOListElement) ||
        this.contactList.addSubContactList(letterKey, sorted);

      if (!contacts.length) return this.removeContactList(letterKey);
      $contactList.innerHTML = '';

      const renderContact = (contact: IContact, index: number) =>
        this.contactList.addContact(
          { contact, letterKey, index },
          $contactList
        );

      contacts.forEach(renderContact);
    } catch (err) {
      console.error(err);
    }
  }

  public updateRemovedContacts = ({ removed }: UpdateContactList): void => {
    if (!removed) return;

    for (const letter in removed) {
      const $list = document.getElementById(
        `letter-${letter}`
      ) as HTMLOListElement;
      if (!$list) continue;

      const removeContact = (index: number) => {
        const $contact = $list.querySelector(`[data-id="${letter}-${index}"]`);
        if ($contact) $contact.remove();
      };
      removed[letter].forEach(removeContact);

      const $rest = $list.querySelectorAll<HTMLElement>('.contact');
      if (!$rest.length) return this.removeContactList(letter);

      $rest.forEach(($el, index) => ($el.dataset.id = `${letter}-${index}`));
    }
  };

  public updateContactList = ({ letterKey }: UpdateContactList) => {
    if (!letterKey) return;

    const { state } = this.ctx;
    const contactList = state.contacts.getList(letterKey);

    if (!contactList) return this.removeContactList(letterKey);
    const sorted = true;
    this.renderContacts(contactList, letterKey, sorted);
  };

  public unMount(): void {
    const { emitter } = this.ctx;

    emitter.clear('updateResultList');
    emitter.clear('updateContactList');
    emitter.remove('toggleResult', this.toggleResult);
  }

  public render(): HTMLElement[] {
    const { state, emitter } = this.ctx;

    emitter.on('updateContactList', this.updateRemovedContacts);
    emitter.on('updateContactList', this.updateContactList);
    emitter.on('toggleResult', this.toggleResult);
    state.contacts.forEachList(this.renderContacts);

    return this.$elements;
  }
}
