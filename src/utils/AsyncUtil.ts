class AsyncUtil {
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
