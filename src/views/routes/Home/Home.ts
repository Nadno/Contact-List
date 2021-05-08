import PageComponent from '../PageComponent';
import Contacts from '../../Contact/Contacts';
import Header from '../../Header';

import { AppContext } from '../../../App';

import { ILinkedList } from '../../../models/LinkedList/types';
import { IContact } from '../../../models/ContactList/types';

import '../../../../public/styles/views/home.scss';

export default class Home extends PageComponent {
  $elements: HTMLElement[];
  contactList: Contacts;

  constructor(private ctx: AppContext) {
    super();
    this.setTitle('Lista de contatos');

    const header = new Header(ctx);

    this.contactList = new Contacts({
      class: 'contacts',
      type: 'A',
    });

    const $header = header.render();
    const $contactList = this.contactList.render();
    const $resultList = header.contactsResult.render();

    this.$elements = [$header, $contactList, $resultList];
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

  private toggleResult(turn: 'on' | 'off') {
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

  public render(): HTMLElement[] {
    const { emitter } = this.ctx;
    
    emitter.on('toggleResult', this.toggleResult.bind(this));
    emitter.emit('forEachContactList', this.renderContacts.bind(this));

    return this.$elements;
  }
}
