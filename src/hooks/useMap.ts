import { useMemo, useState } from "react";

const copy = <K, V>(map: Map<K, V>) => new Map(map);

function useMap<K, V>(iterable?: Iterable<[K, V]>) {
  const [map, update] = useState<Map<K, V>>(new Map(iterable));

  return useMemo(
    () =>
      Object.freeze({
        [Symbol.iterator]: () => map[Symbol.iterator](),
        delete: (k: K) =>
          update((prev) => {
            if (!prev.has(k)) return prev;
            const next = copy(prev);
            next.delete(k);
            return next;
          }),
        get: (k: K) => {
          return map.get(k);
        },
        has: (k: K) => {
          return map.has(k);
        },
        set: (k: K, v: V) =>
          update((prev) => {
            if (prev.has(k) && prev.get(k) === v) return prev;
            const next = copy(prev);
            next.set(k, v);
            return next;
          }),
        size: map.size,
      }),
    [map]
  );
}

export default useMap;
