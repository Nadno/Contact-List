import Contact from '.';
import Component from '../component';
import Settings from './Settings';

import { AppContext } from '../../App';
import { IObserver } from '../../controllers/Observer/types';
import { IContact } from '../../models/ContactList/types';

export default class Contacts extends Component {
  private emitter: IObserver;
  private settings: Settings;

  private $container: HTMLElement;

  constructor({ emitter }: AppContext) {
    super();

    this.emitter = emitter;
    this.settings = new Settings([
      { href: '/edit', label: 'Editar' },
      { href: '/remove', label: 'Apagar' },
    ]);

    this.$container = Component.createElement('ol', [], {
      class: 'contacts',
      type: 'A',
    });

    this.appendContactList = this.appendContactList.bind(this);
  }

  private createContactList(letter: string) {
    const $list = Component.createElement('ol', '', {
      type: 'a',
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
    let currentLetter: string;
    let $contactsList: HTMLElement;

    this.emitter.emit(
      'forEachContact',
      (contact: IContact, letterKey: string, index: number) => {
        if (letterKey !== currentLetter) {
          currentLetter = letterKey;
          $contactsList = this.createContactList(letterKey);
        }

        const contactId = `${letterKey}-${index}`;
        const $contact = new Contact(contact.name, contactId);

        $contactsList.appendChild($contact.render());
      }
    );
  }

  public render(): HTMLElement {
    setTimeout(this.appendContactList, 200);

    this.$container.addEventListener('click', this.settings.handleClick);
    return this.$container;
  }
}
