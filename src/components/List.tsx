import clsx from "clsx";
import Queue from "p-queue";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { get } from "../api";
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

export type Props = { keys: string[] };

function List({ keys }: Props) {
  const [size, setSize] = useState(Math.min(pageSize, keys.length));
  const [data, add] = useReducer(
    (prev, [key, item]) => ({ ...prev, [key]: item }),
    {}
  );

  const slice = useMemo(() => keys.slice(0, size), [keys, size]);

  useEffect(() => {
    slice
      .filter((key) => !(key in data))
      .forEach((key) => {
        queue.add(async () => {
          const result = await get(`item/${key}.json`);
          add([key, result]);
        });
      });
  }, [size]);

  const [selection, setSelection] = useState({});
  const [cursor, setCursor] = useState(undefined);

  const selected = useMemo(
    () =>
      Object.entries(selection)
        .filter(([, value]) => value)
        .map(([key]) => data[key]),
    [data, selection]
  );

  const toggle = useCallback(
    (key) => {
      setSelection({ ...selection, [key]: !selection[key] });
    },
    [selection]
  );

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  const open = useCallback(() => {
    selected.forEach(({ url }) => window.open(url, "_blank"));
  }, [selected]);

  const itemRef = useRef();

  const onToggleSelection = useCallback(
    (event) => {
      toggle(event.target.value);
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
    [cursor, data, keys, reveal, selection, size]
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
                  checked={selection[key] ?? false}
                  onChange={onToggleSelection}
                />
                <span className="w-3ch flex-none text-center text-xs text-stone-400">
                  {index + 1}
                </span>
                {key in data ? (
                  <Item data={data[key]} highlighted={index === cursor} />
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
      {selected.length > 0 && (
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
