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

    this.$elements = [$header, $contactList];
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

  public render(): HTMLElement[] {
    const { emitter } = this.ctx;
    emitter.emit('forEachContactList', this.renderContacts.bind(this));

    return this.$elements;
  }
}
