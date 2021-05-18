import Component from '../../component';
import PopUp from '../PopUp';

class Modal extends PopUp {
  public static $where: HTMLElement;

  public static setStaticWhereElement(where: HTMLElement): void {
    Modal.$where = where;
  }

  public $modal: HTMLElement;
  private $container: HTMLElement;

  constructor(className: string) {
    super('$modal');

    this.$modal = Component.createElement('div', '', {
      className: 'modal ' + className,
    });

    this.$container = Component.createElement('div', [this.$modal], {
      className: 'modal-overlay',
    });
  }

  public unbuild(): void {
    this.$container.remove();
  }

  public build(): HTMLElement {
    return this.$container;
  }
}

Modal.setStaticWhereElement(document.getElementById('modals') || document.body);

export default Modal;
