import Link from '../../controllers/Link';
import Component from '../component';

interface SettingsItem {
  href: string;
  label: string;
}

export default class Settings {
  private $settings: HTMLElement;
  private $settingsLinks: HTMLAnchorElement[];
  private $settingPosition: HTMLElement | null = null;

  constructor(items: SettingsItem[]) {
    const addItemsLinks = ({ href, label }: SettingsItem) =>
      Link({ href, content: label });

    this.$settingsLinks = items.map(addItemsLinks);

    this.$settings = Component.createElement('div', '', {
      class: 'settings',
    });

    const $settingsItems = this.$settingsLinks.map(link =>
      Component.createElement('li', [link])
    );

    const $settings = Component.createElement('ul', $settingsItems, {
      class: 'settings-list',
    });

    this.$settings.appendChild($settings);

    this.handleClick = this.handleClick.bind(this);
  }

  public static SettingButton(): HTMLElement {
    const $dots = [null, null, null].map(() =>
      Component.createElement('span', '', { class: 'dot' })
    );

    const $btn = Component.createElement('button', $dots, {
      class: 'settings-button',
      role: 'switch',
      'aria-label': 'exibir opções de contato',
    });

    const $settingContainer = Component.createElement('div', [$btn], {
      class: 'settings-container',
    });

    return $settingContainer;
  }

  private setLinksParams(params: string): void {
    this.$settingsLinks.forEach(link => (link.href += params));
  }

  private unsetLinksParams(paramSplitter: string): void {
    this.$settingsLinks.forEach(link => {
      const [href] = link.href.split(paramSplitter);
      link.href = href;
    });
  }

  private setButtonAriaChecked(bool: string) {
    if (this.$settingPosition) {
      const $button = this.$settingPosition.querySelector('.settings-button');
      if ($button) $button.setAttribute('aria-checked', bool);
    }
  }

  private moveSettingsTo(to: HTMLElement | null) {
    if (this.$settingPosition) {
      this.setButtonAriaChecked('false');
      this.$settingPosition.classList.remove('on');
      this.unsetLinksParams('?');
    }

    this.$settingPosition = to;
    if (to) {
      to.appendChild(this.$settings);

      const $contact: any = this.$settings.closest('.contact');
      if ($contact) {
        const { id } = $contact.dataset;
        this.setLinksParams(`?id=${id}`);
      }
    }
  }

  private turnSettingsOff() {
    this.$settings.setAttribute('aria-hidden', 'true');
    this.moveSettingsTo(null);

    const removeSettingsElement = () => {
      this.$settings.remove();
      this.$settings.removeEventListener(
        'transitionend',
        removeSettingsElement
      );
    };

    this.$settings.addEventListener('transitionend', removeSettingsElement);
  }

  private turnSettingsOn() {
    if (this.$settingPosition) {
      this.$settings.setAttribute('aria-hidden', 'false');
      this.setButtonAriaChecked('true');

      const turnSettingsPositionOn = () =>
        (this.$settingPosition as HTMLElement).classList.add('on');

      setTimeout(turnSettingsPositionOn, 100);
    }
  }

  public handleClick(e: Event) {
    let $settingsButton = e.target as HTMLElement;
    const parent = $settingsButton.parentNode as HTMLElement;

    if ($settingsButton.matches('.dot')) {
      $settingsButton = parent;
    }

    if ($settingsButton.matches('.settings-button')) {
      e.stopPropagation();
      const $settingsContainer = $settingsButton.parentNode as HTMLElement;

      const isCurrentSettingsOn = $settingsContainer.matches('.on');
      if (isCurrentSettingsOn) return this.turnSettingsOff();

      this.moveSettingsTo($settingsContainer);
      this.turnSettingsOn();
    }
  }
}
