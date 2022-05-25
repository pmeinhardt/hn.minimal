import clsx from "clsx";
import Queue from "p-queue";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { get } from "../api";
import useMap from "../hooks/useMap";
import useSet from "../hooks/useSet";
import useWindowEvent from "../hooks/useWindowEvent";
import type { Entry } from "../types";
import Hints from "./List/Hints";
import Item from "./List/Item";
import href from "./List/link";

const queue = new Queue({ concurrency: 4 });

const pageSize = 15;

export type Props = { ids: number[]; marquee: Element };

function List({ marquee, ids }: Props) {
  const [size, setSize] = useState(Math.min(pageSize, ids.length));

  const data = useMap<number, unknown>();
  const loading = useSet<number>();

  const slice = useMemo(() => ids.slice(0, size), [ids, size]);

  useEffect(() => {
    slice
      .filter((id) => !data.has(id) && !loading.has(id))
      .forEach((id) => {
        queue.add(async () => {
          const result = await get(`item/${id}.json`);
          data.set(id, result);
        });

        loading.add(id);
      });
  }, [data, loading, slice]);

  const [cursor, setCursor] = useState(undefined);
  const selection = useSet<number>();

  const toggle = useCallback(
    (id) => (selection.has(id) ? selection.delete(id) : selection.add(id)),
    [selection]
  );

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, ids.length));
  }, [ids, size]);

  const open = useCallback(
    () =>
      Array.from(selection).forEach((id) => {
        const url = href(data.get(id) as Entry);
        window.open(url, "_blank");
      }),
    [data, selection]
  );

  const itemRef = useRef<HTMLLIElement>();

  const onToggleSelection = useCallback(
    (event) => {
      const id = Number.parseInt(event.target.value, 10);
      toggle(id);
    },
    [toggle]
  );

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "j": // down
          if (typeof cursor === "number") {
            setCursor(Math.min(cursor + 1, size, ids.length - 1));
            if (cursor >= size) reveal();
          } else {
            setCursor(0);
          }
          break;

        case "k": // up
          if (typeof cursor === "number") {
            setCursor(Math.max(cursor - 1, 0));
          }
          break;

        case "x": // toggle
          toggle(ids[cursor]);
          break;

        case "o": // open
          open();
          break;

        default:
          break;
      }
    },
    [cursor, ids, open, reveal, size, toggle]
  );

  useWindowEvent("keydown", onKeyDown);

  useEffect(() => {
    if (itemRef.current) itemRef.current.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <form>
      {ids && (
        <Hints container={marquee}>
          <div className="font-mono text-xs">
            <ul className="flex gap-5">
              <li className={clsx(cursor >= ids.length - 1 && "opacity-50")}>
                <kbd>j</kbd> ↓
              </li>
              <li className={clsx(!(cursor > 0) && "opacity-50")}>
                <kbd>k</kbd> ↑
              </li>
              <li
                className={clsx(typeof cursor === "undefined" && "opacity-50")}
              >
                <kbd>x</kbd> ✓
              </li>
              <li className={clsx(selection.size === 0 && "opacity-50")}>
                <kbd>o</kbd> ▹
              </li>
            </ul>
          </div>
        </Hints>
      )}
      <ol>
        {slice.map((id, index) => (
          <li
            key={id}
            className="-mx-2"
            ref={index === cursor ? itemRef : undefined}
          >
            <div
              className={clsx(
                "flex items-stretch border-b border-stone-200",
                index === cursor && "font-bold"
              )}
            >
              <label className="flex items-center gap-2 px-2 py-3">
                <input
                  className="accent-cyan-600"
                  type="checkbox"
                  value={id}
                  checked={selection.has(id)}
                  onChange={onToggleSelection}
                />
                <span className="w-3ch flex-none text-center text-xs text-stone-400">
                  {index + 1}
                </span>
                {data.has(id) ? (
                  <Item
                    data={data.get(id) as Entry}
                    highlighted={index === cursor}
                  />
                ) : (
                  <a href={href({ id })}>…</a>
                )}
              </label>
            </div>
          </li>
        ))}
        {slice.length < ids.length && (
          <li
            key="more"
            className="-mx-2"
            ref={cursor === size ? itemRef : undefined}
          >
            <button
              type="button"
              onClick={reveal}
              className={clsx(
                "block w-full p-2 text-left",
                cursor === size && "font-bold"
              )}
            >
              Show more
            </button>
          </li>
        )}
      </ol>
      {selection.size > 0 && (
        <div className="fixed bottom-0 right-0 p-4">
          <button
            type="button"
            onClick={open}
            className="text-shadow-flamingo/20 block flex h-10 w-10 items-center justify-center rounded-full bg-sunset/90 text-stone-100 drop-shadow-md"
          >
            ▹
          </button>
        </div>
      )}
    </form>
  );
}

export default List;
