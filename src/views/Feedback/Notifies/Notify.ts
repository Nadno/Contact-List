import AsyncUtil from '../../../utils/AsyncUtil';
import Component from '../../component';
import Dialog from '../Dialog';

export interface NotifyConstructor {
  message: string | HTMLElement[];
  willUnbuild?: Function;
}

export interface NotifyComponents extends Pick<NotifyConstructor, 'message'> {
  where: HTMLElement;
  closeFn?: Function;
  buttons?: Array<HTMLButtonElement | HTMLAnchorElement>;
}

export default class Notify extends Dialog {
  public static async showNotification(
    { where, message, buttons, closeFn }: NotifyComponents,
    willUnbuild?: Function
  ): Promise<void> {
    const notify = new Notify({ message, willUnbuild });

    if (buttons) {
      notify.createButtonsContainer();
      const appendButton = (button: HTMLButtonElement | HTMLAnchorElement) =>
        notify.addButton(button);
      buttons.forEach(appendButton);
    }
    
    notify.createCloseBtn(closeFn);
    where.appendChild(notify.build());

    await AsyncUtil.sleep(150);
    notify.animate();

    const tenSeconds = 10 * 1000;
    await AsyncUtil.sleep(tenSeconds);

    notify.unbuild();
  }

  public $notify: HTMLElement;
  protected willUnbuild?: Function;

  constructor({ message, willUnbuild }: NotifyConstructor) {
    super('$notify');
    this.willUnbuild = willUnbuild;

    this.$notify = Component.createElement('div', '', {
      className: 'notify',
    });

    const $content = Component.createElement('span', message, {
      className: 'notify__content',
    });

    this.addElement($content, 'content');
  }

  public createButtonsContainer(): this {
    const $buttons = Component.createElement('div', '', {
      className: 'notify__buttons',
    });
    this.addElement($buttons, 'buttons');

    return this;
  }

  public addButton(
    button: HTMLButtonElement | HTMLAnchorElement,
    callAgain: boolean = true
  ): this {
    try {
      const $buttons = this.getElementByType('buttons');

      const unbuild = () => this.unbuild();
      button.addEventListener('click', unbuild);
      $buttons.appendChild(button);
    } catch (err) {
      if (callAgain) {
        this.createButtonsContainer();
        this.addButton(button, false);
      } else {
        console.error(err);
      }
    } finally {
      return this;
    }
  }

  public animate(): void {
    this.$notify.classList.add('show');
  }

  public build(): HTMLElement {
    const autoFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.matches('.notify')) return;

      try {
        const $firstEl =
          this.getElementByType('buttons').querySelector('button');
        if ($firstEl) $firstEl.focus();
      } catch {
        this.getElementByType('close').focus();
      }

      this.$notify.removeEventListener('transitionend', autoFocus);
    };
    this.$notify.addEventListener('transitionend', autoFocus);

    return this.$notify;
  }

  public unbuild(): void {
    const removeElement = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.matches('.notify')) return;

      if (this.willUnbuild) this.willUnbuild();
      this.$notify.remove();
      this.$notify.removeEventListener('transitionend', removeElement);
    };

    this.$notify.addEventListener('transitionend', removeElement);
    this.$notify.classList.remove('show');
  }
}
