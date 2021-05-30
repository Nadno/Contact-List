import Contact from '.';
import Component from '../component';
import ContactOptions, { ContactOption } from '../ContactOptions/index';

import RemoveContact from '../ContactOptions/Remove';
import Link from '../../controllers/Link';
import AsyncUtil from '../../utils/AsyncUtil';
import SelectContactList from '../utils/SelectContactList';

import { AppContext, AppState } from '../../App';
import { ContactAndPosition } from '../../models/ContactList/types';

export default class Contacts extends Component {
  public query: SelectContactList;
  private settings: ContactOptions;

  private $list: HTMLElement;
  private $nullEl: HTMLElement;

  constructor(app: AppContext<AppState>, attrs: Record<string, string>) {
    super();

    const remove: ContactOption = ctx =>
      new RemoveContact(
        { className: 'background-animation' },
        ctx,
        app
      ).render();
    const edit: ContactOption = ctx =>
      Link({
        title: 'Editar contato',
        href: 'edit?id=' + ctx.contact.id,
        content: 'Editar',
        className: 'background-animation',
      });

    this.$list = Component.createElement('ol', '', attrs);
    this.query = new SelectContactList(this.$list as HTMLOListElement);

    this.settings = new ContactOptions([edit, remove], this.query);

    this.$list = Component.createElement('ol', '', attrs);
  }

  public insertSortSubContactList(letter: string, $listItem: HTMLLIElement) {
    const $elements = Array.from(
      this.$list.querySelectorAll<HTMLLIElement>('.contact-list')
    );

    for (const $el of $elements) {
      const { letter: letterKey } = $el.dataset;

      if (!letterKey || letterKey > letter) {
        $el.insertAdjacentElement('beforebegin', $listItem);
        break;
      }
    }
  }

  public addSubContactList(
    letter: string,
    sorted: boolean = false
  ): HTMLOListElement {
    const $list = Component.createElement('ol', '', {
      type: 'a',
      id: `letter-${letter}`,
    });

    const $listLabel = Component.createElement('span', letter.toUpperCase(), {
      className: 'contact-list__label',
    });

    const $listItem = Component.createElement('li', [$listLabel, $list], {
      className: 'contact-list',
      'data-letter': letter,
    });

    if (sorted) {
      this.insertSortSubContactList(letter, $listItem);
      return $list;
    }

    this.$nullEl.insertAdjacentElement('beforebegin', $listItem);
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
    const triggerRateLimit = 300;
    this.$list.addEventListener(
      'click',
      AsyncUtil.throttle(this.settings.handleClick, triggerRateLimit)
    );

    this.$list.appendChild(this.$nullEl);
    return this.$list;
  }
}
