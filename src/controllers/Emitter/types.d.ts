export interface IObserver {
  on(event: string, cb: (...args: any) => void): void;
  emit(event: string, ...args: any): void;
}