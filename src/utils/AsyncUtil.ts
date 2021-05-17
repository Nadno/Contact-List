class AsyncUtil {
  public debounce<FN extends Function>(cb: FN, ms: number) {
    let currentTimeout: any;

    function debouncedFn(this: ThisParameterType<FN>) {
      if (currentTimeout) clearTimeout(currentTimeout);
      const args = arguments;

      const finalizeDebounce = () => {
        cb.apply(this, args);
        currentTimeout = undefined;
      };
      currentTimeout = setTimeout(finalizeDebounce, ms);
    }

    return debouncedFn;
  }

  public throttle<FN extends Function>(cb: FN, ms: number) {
    let wait = false;

    function throttledFn(this: ThisParameterType<FN>) {
      if (wait) return;

      wait = !wait;
      cb.apply(this, arguments);
      setTimeout(() => (wait = !wait), ms);
    }

    return throttledFn;
  }

  public sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AsyncUtil();
