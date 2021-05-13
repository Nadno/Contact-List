import Component from '../component';

class Modal extends Component {
  public static $where: HTMLElement;

  public static setStaticWhereElement(where: HTMLElement): void {
    Modal.$where = where;
  }

  public $modal: HTMLElement;
  private $container: HTMLElement;

  constructor(className: string) {
    super();

    this.$modal = Component.createElement('div', '', {
      className: 'modal ' + className,
    });

    this.$container = Component.createElement('div', [this.$modal], {
      className: 'modal-overlay',
    });
  }

  public addElement($el: HTMLElement, type?: string): this {
    if (type) $el.setAttribute('data-type', type);
    this.$modal.appendChild($el);
    return this;
  }

  /**
   * @returns an object with all elements that has an type
   * @example { [type]: HTMLElement }
   */
  public getAllElementsByType(): Record<string, HTMLElement> {
    const elements = this.$modal.querySelectorAll<HTMLElement>('[data-type]');
    const result: Record<string, HTMLElement> = {};

    const getElement = ($el: HTMLElement) => {
      const { type } = $el.dataset;
      if (type) result[`$${type}`] = $el;
    };
    elements.forEach(getElement);

    return result;
  }

  public getElementByType(queryType: string): HTMLElement {
    const result = this.$modal.querySelector<HTMLElement>(
      `[data-type=${queryType}]`
    );

    if (!result) throw new Error('Element not founded');
    return result;
  }

  public unMount(): void {
    this.$container.remove();
  }

  public render(): HTMLElement {
    return this.$container;
  }
}

Modal.setStaticWhereElement(document.getElementById('modals') || document.body);

export default Modal;
