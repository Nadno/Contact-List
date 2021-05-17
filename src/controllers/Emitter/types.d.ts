export interface IEmitter {
  on(event: string, cb: (...args: any) => void): void;
  emit(event: string, ...args: any): void;
  remove(event: string, excludeFunc: Function): void;
}