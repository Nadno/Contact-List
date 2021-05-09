import Contact from '.';
import Component from '../component';
import Settings from './Settings';

import { ContactAndPosition } from '../../models/ContactList/types';

export default class Contacts extends Component {
  private settings: Settings;
  private $list: HTMLElement;

  constructor(attrs: Record<string, string>) {
    super();

    this.settings = new Settings([
      { href: '/edit', label: 'Editar' },
      { href: '/remove', label: 'Apagar' },
    ]);

    this.$list = Component.createElement('ol', [], attrs);
  }

  public addSubContactList(letter: string): HTMLOListElement {
    const $list = Component.createElement('ol', '', {
      type: 'a',
    });

    const $listLabel = Component.createElement('span', letter.toUpperCase(), {
      class: 'contact-list__label',
    });

    this.$list.appendChild(
      Component.createElement('li', [$listLabel, $list], {
        class: 'contact-list',
      })
    );

    return $list;
  }

  public addContact(
    { contact, letterKey, index }: ContactAndPosition,
    subList?: HTMLOListElement
  ): void {
    const $list = subList ? subList : this.$list;

    const contactId = `${letterKey}-${index}`;
    const contactName = contact.name || 'Sem nome';
    
    const $contact = new Contact(contactName, contactId).render();
    $list.appendChild($contact);
  }

  public clearList(): void {
    this.$list.innerHTML = '';
  }

  public render(): HTMLElement {
    this.$list.addEventListener('click', this.settings.handleClick);
    return this.$list;
  }
}
