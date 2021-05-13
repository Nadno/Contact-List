import Component from '../component';
import sleep from '../utils/sleep';

export interface ContactOptionsContext {
  contactId: string;
  $contact: HTMLElement;
  closeOptions: (clearCb: Function) => any;
}

export type ContactOption = ({}: ContactOptionsContext) => HTMLElement;

export default class ContactOptions {
  private $options: HTMLElement;
  private $optionsList: HTMLElement;
  private $optionPosition: HTMLElement | null = null;

  constructor(private options: Array<ContactOption>) {
    this.$options = Component.createElement('div', '', {
      className: 'options',
    });

    this.$optionsList = Component.createElement('ul', '', {
      className: 'option-list',
    });

    this.$options.appendChild(this.$optionsList);

    this.handleClick = this.handleClick.bind(this);
  }

  public static OptionsButton(): HTMLElement {
    const $dots = [null, null, null].map(() =>
      Component.createElement('span', '', { className: 'dot' })
    );

    const $btn = Component.createElement('button', $dots, {
      className: 'options-button',
      role: 'switch',
      'aria-label': 'exibir opções de contato',
    });

    const $settingContainer = Component.createElement('div', [$btn], {
      className: 'options-container',
    });

    return $settingContainer;
  }

  protected renderOptions($contact: HTMLElement): void {
    this.$optionsList.innerHTML = '';

    const optionContext = {
      $contact,
      contactId: $contact.dataset.id || '',
      closeOptions: this.turnSettingsOff.bind(this),
    };

    const appendOption = (option: ContactOption) =>
      this.$optionsList.appendChild(
        Component.createElement('li', [option(optionContext)], {
          className: 'option',
        })
      );

    this.options.forEach(appendOption);
  }

  private setButtonAriaChecked(bool: string) {
    if (this.$optionPosition) {
      const $button = this.$optionPosition.querySelector('.options-button');
      if ($button) $button.setAttribute('aria-checked', bool);
    }
  }

  private moveOptionsTo(to: HTMLElement | null) {
    if (this.$optionPosition) {
      this.setButtonAriaChecked('false');
      this.$optionPosition.classList.remove('on');
    }

    this.$optionPosition = to;
    if (to) {
      to.appendChild(this.$options);

      const $contact = this.$options.closest<HTMLElement>('.contact');
      if ($contact) this.renderOptions($contact);
    }
  }

  private turnSettingsOff(clearCb?: Function) {
    this.$options.setAttribute('aria-hidden', 'true');
    this.moveOptionsTo(null);

    const removeOptionsElement = () => {
      if (clearCb) clearCb();
      this.$options.remove();
      this.$options.removeEventListener('transitionend', removeOptionsElement);
    };

    this.$options.addEventListener('transitionend', removeOptionsElement);
  }

  private async turnOptionsOn() {
    if (this.$optionPosition) {
      this.$options.setAttribute('aria-hidden', 'false');
      this.setButtonAriaChecked('true');

      await sleep(100);
      this.$optionPosition.classList.add('on');
    }
  }

  public handleClick(e: Event) {
    let $optionsButton = e.target as HTMLElement;
    const parent = $optionsButton.parentNode as HTMLElement;

    if ($optionsButton.matches('.dot')) {
      $optionsButton = parent;
    }

    if ($optionsButton.matches('.options-button')) {
      const $optionsContainer = $optionsButton.parentNode as HTMLElement;

      const isCurrentSettingsOn = $optionsContainer.matches('.on');
      if (isCurrentSettingsOn) return this.turnSettingsOff();

      this.moveOptionsTo($optionsContainer);
      this.turnOptionsOn();
    }
  }
}
