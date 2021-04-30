import Contact from '.';
import Component from '../component';
import ContactList from '../../models/ContactList';

import { AppContext } from '../../App';

export default class Contacts extends Component {
  private contacts: ContactList;

  private $container: HTMLElement;

  constructor({ contacts }: AppContext) {
    super();

    this.$container = Component.createElement('ol', [], {
      class: 'contacts',
      type: 'A',
    });

    this.contacts = contacts;

    this.appendContactList = this.appendContactList.bind(this);
  }

  private createLetterList(letter: string) {
    const $list = Component.createElement('ol', '', {
      type: 'a',
      'data-letter': letter,
    });

    const $listLabel = Component.createElement('span', letter.toUpperCase(), {
      class: 'contact-list__label',
    });

    const $contactsListItem = Component.createElement(
      'li',
      [$listLabel, $list],
      {
        class: 'contact-list',
      }
    );

    this.$container.insertAdjacentElement('beforeend', $contactsListItem);

    return $list;
  }

  private appendContactList() {
    let currentLetter;
    let $contactsList;

    for (const { contact, letter, index } of this.contacts) {
      if (letter !== currentLetter) {
        currentLetter = letter;
        $contactsList = this.createLetterList(letter);
      }

      const contactId = String(index);

      const $contact = new Contact(contact.name, contactId);
      ($contactsList as HTMLElement).insertAdjacentElement(
        'beforeend',
        $contact.render()
      );
    }
  }

  public render(): HTMLElement {
    setTimeout(this.appendContactList, 500);

    return this.$container;
  }
}
