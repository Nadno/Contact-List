import Contact from '.';
import Component from '../component';
import ContactOptions, { ContactOption } from '../ContactOptions/index';

import RemoveContact from '../ContactOptions/Remove';
import Link from '../../controllers/Link';

import { AppContext, AppState } from '../../App';
import { ContactAndPosition } from '../../models/ContactList/types';

export default class Contacts extends Component {
  private settings: ContactOptions;
  private $list: HTMLElement;

  constructor(app: AppContext<AppState>, attrs: Record<string, string>) {
    super();

    const remove: ContactOption = ctx => new RemoveContact(ctx, app).render();
    const edit: ContactOption = ctx =>
      Link({
        title: 'Editar contato',
        href: 'edit?id=' + ctx.contactId,
        content: 'Editar',
      });

    this.settings = new ContactOptions([edit, remove]);
    this.$list = Component.createElement('ol', '', attrs);
  }

  public addSubContactList(letter: string): HTMLOListElement {
    const $list = Component.createElement('ol', '', {
      type: 'a',
      id: `letter-${letter}`,
    });

    const $listLabel = Component.createElement('span', letter.toUpperCase(), {
      className: 'contact-list__label',
    });

    this.$list.appendChild(
      Component.createElement('li', [$listLabel, $list], {
        className: 'contact-list',
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
