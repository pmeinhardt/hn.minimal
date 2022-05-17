import { useMemo, useState } from "react";

const copy = <T>(set: Set<T>) => new Set<T>(set);

function useSet<T>(iterable?: Iterable<T>) {
  const [set, update] = useState<Set<T>>(() => new Set(iterable));

  return useMemo(
    () =>
      Object.freeze({
        [Symbol.iterator]: () => set[Symbol.iterator](),
        add: (x: T) =>
          update((prev) => {
            if (prev.has(x)) return prev;
            const next = copy(prev);
            next.add(x);
            return next;
          }),
        delete: (x: T) =>
          update((prev) => {
            if (!prev.has(x)) return prev;
            const next = copy(prev);
            next.delete(x);
            return next;
          }),
        has: (x: T) => {
          return set.has(x);
        },
        size: set.size,
      }),
    [set]
  );
}

export default useSet;
