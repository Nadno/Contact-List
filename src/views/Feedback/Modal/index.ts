import Component from '../../component';
import PopUp from '../Dialog';

class Modal extends PopUp {
  public static $where: HTMLElement;

  public static setStaticWhereElement(where: HTMLElement): void {
    Modal.$where = where;
  }

  public $modal: HTMLElement;
  private $container: HTMLElement;

  constructor({ className = '', ...attrs }: Record<string, string>) {
    super('$modal');

    this.$modal = Component.createElement('div', '', {
      ...attrs,
      className: 'modal',
    });

    if (className) {
      const classNames = className.trim().split(' ');
      classNames.forEach(className => this.$modal.classList.add(className));
    }

    this.$container = Component.createElement('div', [this.$modal], {
      className: 'modal-overlay',
    });
  }

  public unbuild(): void {
    this.$container.remove();
  }

  public build(): HTMLElement {
    this.createCloseBtn();
    return this.$container;
  }
}

Modal.setStaticWhereElement(document.getElementById('modals') || document.body);

export default Modal;
