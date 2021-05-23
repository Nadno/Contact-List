import AsyncUtil from '../../utils/AsyncUtil';
import Component from '../component';

export interface ContactOptionsContext {
  contact: {
    id: string;
    element: HTMLElement;
  };
  options: ContactOptions;
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

    this.$optionsList.addEventListener('focusout', this.handleFocusout);
    this.$options.addEventListener('keyup', this.handleScape);

    this.$options.appendChild(this.$optionsList);
  }

  public static OptionsButton(): HTMLElement {
    const $dots = [null, null, null].map(() =>
      Component.createElement('span', '', { className: 'dot' })
    );

    const $btn = Component.createElement('button', $dots, {
      className: 'options-button background-animation',
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
      contact: {
        id: $contact.dataset.id || '',
        element: $contact,
      },
      options: this,
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

  private moveOptionsTo(to: HTMLElement | null): void {
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

  public turnSettingsOff = (): void => {
    if (!this.$optionPosition) return;

    this.$options.setAttribute('aria-hidden', 'true');
    this.moveOptionsTo(null);

    const removeOptionsElement = () => {
      this.$options.removeEventListener('transitionend', removeOptionsElement);
      this.$options.remove();
    };

    this.$options.addEventListener('transitionend', removeOptionsElement);
  };

  public turnOptionsOn = async (): Promise<void> => {
    if (!this.$optionPosition) return;

    this.$options.setAttribute('aria-hidden', 'false');
    this.setButtonAriaChecked('true');

    await AsyncUtil.sleep(100);
    this.$optionPosition.classList.add('on');
  };

  protected handleFocusout = ({ target }: Event) => {
    const $option = (target as HTMLElement).parentNode as HTMLElement;
    const isLastItem = !$option.nextSibling;
    if (isLastItem) this.turnSettingsOff();
  };

  protected handleScape = ({ code }: KeyboardEvent) => {
    if (code !== 'Escape') return;
    this.focus();
    this.turnSettingsOff();
  };

  public focus(): void {
    if (!this.$optionPosition) return;

    const $btn =
      this.$optionPosition.querySelector<HTMLElement>('.options-button');
    if ($btn) $btn.focus();
  }

  public handleClick = ({ target }: MouseEvent): void => {
    let $optionsButton = target as HTMLElement;
    if (!$optionsButton.matches('.options-button')) return;

    const $optionsContainer = $optionsButton.parentNode as HTMLElement;

    const isCurrentSettingsOn = $optionsContainer.matches('.on');
    if (isCurrentSettingsOn) return this.turnSettingsOff();

    this.moveOptionsTo($optionsContainer);
    this.turnOptionsOn();
  };
}
