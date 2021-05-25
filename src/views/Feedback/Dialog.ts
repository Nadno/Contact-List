import Component from "../component";

export default abstract class Dialog {
  protected mainElementPropertyName: string;

  constructor(mainElementPropertyName: string) {
    this.mainElementPropertyName = mainElementPropertyName;
  }

  get $element(): HTMLElement {
    const $element = (this as any)[this.mainElementPropertyName] as HTMLElement;
    if (!$element)
      throw new Error('The default element does not exist in this context');
    return $element;
  }

  public addElement($el: HTMLElement, type?: string): this {
    if (type) $el.setAttribute('data-type', type);
    this.$element.appendChild($el);
    return this;
  }

  /**
   * @returns an object with all elements that has an type
   * @example { [type]: HTMLElement }
   */
  public getAllElementsByType(): Record<string, HTMLElement> {
    const elements = this.$element.querySelectorAll<HTMLElement>('[data-type]');
    const result: Record<string, HTMLElement> = {};

    const getElement = ($el: HTMLElement) => {
      const { type } = $el.dataset;
      if (type) result[`$${type}`] = $el;
    };
    elements.forEach(getElement);

    return result;
  }

  public getElementByType(queryType: string): HTMLElement {
    const result = this.$element.querySelector<HTMLElement>(
      `[data-type=${queryType}]`
    );

    if (!result) throw new Error('Element not found');
    return result;
  }

  public createCloseBtn(closeFn?: Function): this {
    const $close = Component.createElement('button', 'x', {
      className: 'notify__close',
    });

    const closeNotify = () => {
      closeFn && closeFn();
      this.unbuild();
      $close.removeEventListener('click', closeNotify);
    };

    $close.addEventListener('click', closeNotify);
    this.addElement($close, 'close');

    return this;
  }

  public abstract unbuild(): void;

  public abstract build(): HTMLElement;
}
