import Queue from "p-queue";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";

import { get } from "./api";
import useWindowEvent from "./interaction/useWindowEvent";
import Header from "./layout/Header";
import Main from "./layout/Main";

const queue = new Queue({ concurrency: 4 });

const cls = (...args) => args.filter((c) => c).join(" ");

const open = ({ url }) => window.open(url, "_blank");

const pageSize = 30;

function Loader() {
  return (
    <div className="flex gap-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-stone-300" />
      <div className="animate-delay-200 h-2 w-2 animate-bounce rounded-full bg-stone-300" />
      <div className="animate-delay-400 h-2 w-2 animate-bounce rounded-full bg-stone-300" />
    </div>
  );
}

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
        className={cls("ml-2 text-xs text-stone-400", !highlighted && "hidden")}
      >
        {host}
      </span>
    </div>
  );
}

function List({ keys }: { keys: string[] }) {
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

  const itemRef = useRef();

  const onToggleSelection = useCallback(
    (event) => {
      const key = event.target.value;
      setSelection({ ...selection, [key]: !selection[key] });
    },
    [selection]
  );

  const onKeyDown = useWindowEvent(
    "keydown",
    (event) => {
      switch (event.key) {
        case "j": // down
          if (typeof cursor === "number") {
            setCursor(Math.min(cursor + 1, size - 1));
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
          setSelection({
            ...selection,
            [keys[cursor]]: !selection[keys[cursor]],
          });
          break;

        case "o": // open
          Object.entries(selection)
            .filter(([, selected]) => selected)
            .map(([key]) => data[key])
            .forEach(open);
          break;

        default:
          break;
      }
    },
    [cursor, selection]
  );

  useWindowEvent("keydown", onKeyDown);

  useEffect(() => {
    itemRef.current?.scrollIntoView({ block: "nearest" });
  }, [itemRef.current]);

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  return (
    <form>
      <ol>
        {slice.map((key, index) => (
          <li key={key} ref={index === cursor ? itemRef : undefined}>
            <div
              className={cls(
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
                  "…"
                )}
              </label>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={reveal}>
        More
      </button>
      <Loader />
    </form>
  );
}

function App() {
  const [error, setError] = useState(undefined);
  const [keys, setKeys] = useState(undefined);

  useEffect(() => {
    (async function load() {
      try {
        const result = await get("topstories.json");
        setKeys(result);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  const loading = !keys;

  return (
    <>
      <Header>
        <h1 className="text-shadow-flamingo/20 px-2 text-2xl font-bold text-stone-100">
          hn
        </h1>
      </Header>
      <Main>
        {error && <strong>Oops!</strong>}
        {keys ? <List keys={keys} /> : <p>Loading stories…</p>}
      </Main>
    </>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(<App />);
