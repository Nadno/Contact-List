const throttle = <FN extends Function>(callback: FN, ms: number) => {
  let wait = false;

  function throttledFn(this: ThisParameterType<FN>) {
    if (wait) return;

    wait = !wait;
    callback.apply(this, arguments);
    setTimeout(() => (wait = !wait), ms);
  }

  return throttledFn;
};

export default throttle;
