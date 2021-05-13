import Component from '../component';
import Modal from '.';
import ModalTemplate from './ModalTemplate';

export default class ConfirmModal extends Modal {
  public static confirm(
    message: string,
    where?: HTMLElement
  ): Promise<boolean> {
    return ModalTemplate.defaultTemplate(new ConfirmModal(where))
      .setMessage(message)
      .showModal();
  }

  private $confirm: HTMLButtonElement;
  private $reject: HTMLButtonElement;

  constructor(private where: HTMLElement = Modal.$where) {
    super('--confirm-modal');

    this.$confirm = Component.createElement('button', 'Sim', {
      className: 'modal__button',
    });

    this.$reject = Component.createElement('button', 'Não', {
      className: 'modal__button --reject',
    });
  }

  public setMessage(message: string): this {
    this.getElementByType('content').textContent = message;
    return this;
  }

  public confirm(): Promise<boolean> {
    const { $confirm, $reject } = this;

    const handleButtons = (
      resolve: (answer: boolean | Promise<boolean>) => any
    ) => {
      const handleReject = () => {
        this.unMount();
        resolve(false);

        $confirm.removeEventListener('click', handleConfirm);
        $reject.removeEventListener('click', handleReject);
      };

      const handleConfirm = () => {
        this.unMount();
        resolve(true);

        $confirm.removeEventListener('click', handleConfirm);
        $reject.removeEventListener('click', handleReject);
      };

      $confirm.addEventListener('click', handleConfirm);
      $reject.addEventListener('click', handleReject);
    };

    return new Promise(handleButtons);
  }

  public render(): HTMLElement {
    const $buttons = this.getElementByType('buttons');

    const { $confirm, $reject } = this;
    $buttons.appendChild($confirm);
    $buttons.appendChild($reject);

    return super.render();
  }

  public showModal(): Promise<boolean> {
    this.where.appendChild(this.render());
    return this.confirm();
  }
}
