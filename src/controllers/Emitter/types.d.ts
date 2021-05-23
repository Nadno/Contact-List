export interface IEmitter {
  on(event: string, cb: (...args: any) => void): void;
  emit(event: string, ...args: any): void;
  clear(event: string): boolean;
  remove(event: string, excludeFunc: Function): void;
}