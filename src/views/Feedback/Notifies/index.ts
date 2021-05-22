import LinkedList from '../../../models/LinkedList';
import Notify, { NotifyComponents } from './Notify';

interface NotificationObject extends Omit<NotifyComponents, 'where'> {}

export default class NotifyList {
  private queue = new LinkedList<NotificationObject>(10);
  private $notify: HTMLElement;
  private hasCurrent = false;

  constructor(elementId: string) {
    this.$notify = document.getElementById(elementId) || document.body;
  }

  public showNotify(notify: NotificationObject): void {
    Notify.showNotification(
      {
        ...notify,
        where: this.$notify,
      },
      this.updateNotify
    );
    this.hasCurrent = true;
  }

  public addNotify(notify: NotificationObject): void {
    if (this.hasCurrent) {
      this.queue.push(notify);
      return;
    }

    this.showNotify(notify);
  }

  public updateNotify = (): void => {
    this.hasCurrent = false;
    const next = this.queue.shift();
    if (next) this.showNotify(next.value);
  };

  public clear = (): void => this.queue.forEach(() => this.queue.shift());
}
