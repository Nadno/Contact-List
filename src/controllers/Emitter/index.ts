import LinkedArray from '../../models/LinkedList/LinkedArray';

import { IEmitter } from './types';
import { ILinkedArray } from '../../models/LinkedList/types';

class Emitter implements IEmitter {
	private events: Record<string, ILinkedArray<Function>> = {};

	public on(event: string, cb: (...args: any) => void): void {
		if (event in this.events) {
			this.events[event].push(cb);
			return;
		}

		this.events[event] = new LinkedArray<Function>();
		this.events[event].push(cb);
	}

	public emit(event: string, ...args: any): void {
		if (!(event in this.events)) return;
		this.events[event].forEach((cb) => cb(...args));
	}

	public clear(event: string): boolean {
		return delete this.events[event];
	}

	public remove(event: string, excludeFunc: Function): void {
		if (!(event in this.events)) return;
		const list = this.events[event];

		for (const node of list) {
			if (node.value === excludeFunc) {
				list.remove(node);
				break;
			}
		}
	}
}

export default Emitter;
