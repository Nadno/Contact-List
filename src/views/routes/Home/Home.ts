import PageComponent from '../PageComponent';
import Contacts from '../../Contact/Contacts';
import Header from '../../Header';

import { AppContext, AppState } from '../../../App';

import { ILinkedList } from '../../../models/LinkedList/types';
import { IContact } from '../../../models/ContactList/types';

import '../../../../public/styles/views/home.scss';

interface UpdateContactList {
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

    this.contactList = new Contacts(ctx, {
      className: 'contacts',
      type: 'A',
    });

    const $header = header.render();
    const $contactList = this.contactList.render();
    const $resultList = header.contactsResult.render();

    this.$elements = [$header, $contactList, $resultList];

    this.toggleResult = this.toggleResult.bind(this);
    this.renderContacts = this.renderContacts.bind(this);
  }

  private renderContacts(
    contacts: ILinkedList<IContact>,
    letterKey: string
  ): void {
    const $contactsList = this.contactList.addSubContactList(letterKey);

    const renderContact = (contact: IContact, index: number) =>
      this.contactList.addContact({ contact, letterKey, index }, $contactsList);

    contacts.forEach(renderContact);
  }

  public updateRemovedContacts({ removed }: UpdateContactList): void {
    if (!removed) return;

    for (const letter in removed) {
      const $list = document.getElementById(`letter-${letter}`);
      if (!$list) continue;

      const removeContact = (index: number) => {
        const $contact = $list.querySelector(`[data-id=${letter}-${index}]`);
        if ($contact) $contact.remove();
      };
      removed[letter].forEach(removeContact);

      const $rest = $list.querySelectorAll<HTMLElement>('.contact');
      if (!$rest.length) return $list.closest('.contact-list')?.remove();

      $rest.forEach(($el, index) => ($el.dataset.id = `${letter}-${index}`));
    }
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

  public unMount(): void {
    const { emitter } = this.ctx;

    emitter.remove('updateContactList', this.updateRemovedContacts);
    emitter.remove('toggleResult', this.toggleResult);
  }

  public render(): HTMLElement[] {
    const { state, emitter } = this.ctx;

    emitter.on('updateContactList', this.updateRemovedContacts);
    emitter.on('toggleResult', this.toggleResult);
    state.contacts.forEachList(this.renderContacts);

    return this.$elements;
  }
}
