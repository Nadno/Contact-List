type WrapperCallback<C extends (...args: any) => any> = (
  ...args: Parameters<C>
) => void;

class AsyncUtil {
  public debounce<C extends (...args: any) => any>(
    cb: C,
    ms: number
  ): WrapperCallback<C> {
    let currentTimeout: any;

    const debouncedCb: WrapperCallback<C> = (...args) => {
      if (currentTimeout) clearTimeout(currentTimeout);

      const finishDebounce = () => {
        cb.apply(null, args);
        currentTimeout = undefined;
      };
      currentTimeout = setTimeout(finishDebounce, ms);
    };

    return debouncedCb;
  }

  public throttle<C extends (...args: any) => any>(
    cb: C,
    ms: number
  ): WrapperCallback<C> {
    let wait = false;

    const throttledCb: WrapperCallback<C> = async (...args) => {
      if (wait) return;
      
      wait = !wait;
      cb.apply(null, args);

      await this.sleep(ms);
      wait = !wait;
    };

    return throttledCb;
  }

  public sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AsyncUtil();
