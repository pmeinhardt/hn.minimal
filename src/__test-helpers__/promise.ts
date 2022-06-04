type Resolve<T> = (value: T) => void;
type Reject = (reason: any) => void;

export function deferred<T = unknown>(): [
  Promise<T>,
  { resolve: Resolve<T>; reject: Reject }
] {
  let resolve;
  let reject;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return [promise, { resolve, reject }];
}

export function flush(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}
