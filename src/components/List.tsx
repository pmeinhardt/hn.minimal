import clsx from "clsx";
import Queue from "p-queue";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { get } from "../api";
import useMap from "../hooks/useMap";
import useSet from "../hooks/useSet";
import useWindowEvent from "../hooks/useWindowEvent";

const queue = new Queue({ concurrency: 4 });

const pageSize = 15;

function Item({
  data,
  highlighted,
}: {
  data: { title: string; url?: string };
  highlighted: boolean;
}) {
  const host = useMemo(() => data.url && new URL(data.url).host, [data.url]);

  return (
    <div>
      <a
        href={data.url}
        className="text-sm text-stone-800 visited:text-stone-400"
      >
        {data.title}
      </a>
      <span
        className={clsx(
          "ml-2 text-xs text-stone-400",
          !highlighted && "hidden"
        )}
      >
        {host}
      </span>
    </div>
  );
}

export type Props = { keys: number[] };

function List({ keys }: Props) {
  const [size, setSize] = useState(Math.min(pageSize, keys.length));

  const data = useMap<number, unknown>();
  const loading = useSet<number>();

  const slice = useMemo(() => keys.slice(0, size), [keys, size]);

  useEffect(() => {
    slice
      .filter((key) => !data.has(key) && !loading.has(key))
      .forEach((key) => {
        queue.add(async () => {
          const result = await get(`item/${key}.json`);
          data.set(key, result);
        });

        loading.add(key);
      });
  }, [data, loading, slice]);

  const selection = useSet<number>();
  const [cursor, setCursor] = useState(undefined);

  const toggle = useCallback(
    (key) => (selection.has(key) ? selection.delete(key) : selection.add(key)),
    [selection]
  );

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  const open = useCallback(
    () =>
      Array.from(selection).forEach((key) => {
        const { url } = data.get(key);
        window.open(url, "_blank");
      }),
    [data, selection]
  );

  const itemRef = useRef();

  const onToggleSelection = useCallback(
    (event) => {
      const key = Number.parseInt(event.target.value, 10);
      toggle(key);
    },
    [toggle]
  );

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "j": // down
          if (typeof cursor === "number") {
            setCursor(Math.min(cursor + 1, size, keys.length));
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
          toggle(keys[cursor]);
          break;

        case "o": // open
          open();
          break;

        default:
          break;
      }
    },
    [cursor, keys, open, reveal, size, toggle]
  );

  useWindowEvent("keydown", onKeyDown);

  useEffect(() => {
    itemRef.current?.scrollIntoView({ block: "nearest" });
  }, [itemRef.current]);

  return (
    <form>
      <ol>
        {slice.map((key, index) => (
          <li
            key={key}
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
                  value={key}
                  checked={selection.has(key)}
                  onChange={onToggleSelection}
                />
                <span className="w-3ch flex-none text-center text-xs text-stone-400">
                  {index + 1}
                </span>
                {data.has(key) ? (
                  <Item data={data.get(key)} highlighted={index === cursor} />
                ) : (
                  <a href={`https://news.ycombinator.com/item?id=${key}`}>…</a>
                )}
              </label>
            </div>
          </li>
        ))}
        {slice.length < keys.length && (
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
