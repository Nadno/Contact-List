import Contact from '.';
import Component from '../component';
import Settings from './Settings';
import ContactList from '../../models/ContactList';

import { AppContext } from '../../App';

export default class Contacts extends Component {
  private contacts: ContactList;

  private $container: HTMLElement;
  private $settings: HTMLElement;
  private $settingPosition: HTMLElement | null = null;

  constructor({ contacts }: AppContext) {
    super();

    this.$container = Component.createElement('ol', [], {
      class: 'contacts',
      type: 'A',
    });

    this.contacts = contacts;
    this.$settings = new Settings([
      { href: '/edit', label: 'Editar' },
      { href: '/remove', label: 'Apagar' },
    ]).render();

    this.appendContactList = this.appendContactList.bind(this);
    this.handleToggleSettings = this.handleToggleSettings.bind(this);
  }

  public turnSettingPositionOff() {
    if (this.$settingPosition) {
      this.$settingPosition.setAttribute('aria-checked', 'false');
      this.$settingPosition.classList.remove('on');
      this.$settingPosition = null;
    }
  }

  public handleToggleSettings(e: Event) {
    let target = e.target as HTMLElement;
    const parent = target.parentNode as HTMLElement;

    if (parent && parent.matches('.contact__edit')) {
      target = parent;
    }

    if (target.matches('.contact__edit')) {
      if (target.matches('.on')) {
        const turnSettingsOff = () => {
          this.$settings.remove();
          this.$settings.removeEventListener('transitionend', turnSettingsOff);
        };
        this.$settings.addEventListener('transitionend', turnSettingsOff);

        this.$settings.setAttribute('aria-hidden', 'true');
        this.turnSettingPositionOff();
        target.classList.remove('on');

        return;
      }

      if (this.$settingPosition) {
        this.turnSettingPositionOff();
      }

      this.$settingPosition = target;
      this.$settingPosition.insertAdjacentElement('beforeend', this.$settings);

      this.$settings.setAttribute('aria-hidden', 'false');
      this.$settingPosition.setAttribute('aria-checked', 'true');

      const turnSettingsPositionOn = () =>
        (this.$settingPosition as HTMLElement).classList.add('on');

      setTimeout(turnSettingsPositionOn, 100);
    }
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

    this.$container.addEventListener('click', this.handleToggleSettings);
    return this.$container;
  }
}
