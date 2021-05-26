import Component from '../../component';
import Modal from '.';
import ModalTemplate from './ModalTemplate';

export default class WarnModal extends Modal {
  public static warn(
    message: string,
    action?: Function,
    where?: HTMLElement
  ): void {
    ModalTemplate.defaultTemplate(new WarnModal(where, action))
      .setMessage(message)
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

  public setMessage(message: string): this {
    this.getElementByType('content').textContent = message;
    return this;
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

    return super.build();
  }

  public showModal(): void {
    this.where.appendChild(this.build());
    this.warn();
  }
}
