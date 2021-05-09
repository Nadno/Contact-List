import LinkedList from '../../models/LinkedList';

import { IObserver } from './types';
import { ILinkedList } from '../../models/LinkedList/types';

class Observer implements IObserver {
  events: Record<string, ILinkedList<Function>> = {};

  public on(event: string, cb: (...args: any) => void): void {
    if (event in this.events) {
      this.events[event].push(cb);
      return;
    }

    this.events[event] = new LinkedList<Function>();
    this.events[event].push(cb);
  }

  public emit(event: string, ...args: any): void {
    if (!(event in this.events)) return;
    this.events[event].forEach(cb => cb(...args));
  }
}

export default new Observer();