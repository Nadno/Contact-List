import Component from '../../component';
import Modal from '.';
import ModalTemplate from './ModalTemplate';

export interface IConfirm {
  message: string;
  title: string;
  where?: HTMLElement;
}

export default class ConfirmModal extends Modal {
  public static confirm({ message, title, where }: IConfirm): Promise<boolean> {
    return ModalTemplate(new ConfirmModal(where))
      .setMessage(message)
      .setTitle(title)
      .showModal();
  }

  private $confirm: HTMLButtonElement;
  private $reject: HTMLButtonElement;

  constructor(private where: HTMLElement = Modal.$where) {
    super({
      className: '--confirm-modal',
    });

    this.$confirm = Component.createElement('button', 'Sim', {
      className: 'button default-btn modal__button',
    });

    this.$reject = Component.createElement('button', 'Não', {
      className: 'button default-btn modal__button --red',
    });
  }

  public confirm(): Promise<boolean> {
    const { $confirm, $reject } = this;

    const handleButtons = (
      resolve: (answer: boolean | Promise<boolean>) => any
    ) => {
      this.createCloseBtn(() => resolve(false));

      const handleReject = () => {
        this.unbuild();
        resolve(false);

        $confirm.removeEventListener('click', handleConfirm);
        $reject.removeEventListener('click', handleReject);
      };

      const handleConfirm = () => {
        this.unbuild();
        resolve(true);

        $confirm.removeEventListener('click', handleConfirm);
        $reject.removeEventListener('click', handleReject);
      };

      $confirm.addEventListener('click', handleConfirm);
      $reject.addEventListener('click', handleReject);
    };

    return new Promise(handleButtons);
  }

  public build(): HTMLElement {
    const $buttons = this.getElementByType('buttons');

    const { $confirm, $reject } = this;
    $buttons.appendChild($confirm);
    $buttons.appendChild($reject);

    return super.build();
  }

  public showModal(): Promise<boolean> {
    this.where.appendChild(this.build());
    this.$confirm.focus();
    return this.confirm();
  }
}
