import Component from '../../component';
import Modal from '.';
import ModalTemplate from './ModalTemplate';

export interface IWarn {
  message: string;
  title: string;
  action?: Function;
  where?: HTMLElement;
}

export default class WarnModal extends Modal {
  public static warn({ message, title, action, where }: IWarn): void {
    ModalTemplate(new WarnModal(where, action))
      .setMessage(message)
      .setTitle(title)
      .showModal();
  }

  private $ok: HTMLButtonElement;

  constructor(
    private where: HTMLElement = Modal.$where,
    private okAction?: Function
  ) {
    super({
      className: '--warn-modal',
    });

    this.$ok = Component.createElement('button', 'OK', {
      className: 'button modal__button',
    });
  }

  public warn(): void {
    const handleWarn = () => {
      this.unbuild();
      this.$ok.removeEventListener('click', handleWarn);

      if (this.okAction) this.okAction();
    };

    this.$ok.addEventListener('click', handleWarn);
  }

  public build(): HTMLElement {
    const $buttons = this.getElementByType('buttons');

    const { $ok } = this;
    $buttons.appendChild($ok);

    this.createCloseBtn();
    return super.build();
  }

  public showModal(): void {
    this.where.appendChild(this.build());
    this.warn();
  }
}
