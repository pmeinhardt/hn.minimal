import ky from "ky";
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

import useWindowEvent from "./interaction/useWindowEvent";

const api = ky.create({ prefixUrl: "https://hacker-news.firebaseio.com/v0/" });

const fetch = (key) => api.get(key).json();

const queue = new Queue({ concurrency: 4 });

const cls = (...args) => args.filter((c) => c).join(" ");

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

function Item({ data, highlighted }) {
  const host = useMemo(() => data.url && new URL(data.url).host, [data.url]);

  return (
    <div>
      <a
        href={data.url}
        className={cls("link dark-gray dim text-sm", highlighted && "red")}
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

function List({ keys }) {
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
          const result = await fetch(`item/${key}.json`);
          add([key, result]);
        });
      });
  }, [size]);

  const [selection, setSelection] = useState({});
  const [cursor, setCursor] = useState(undefined);

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
            .forEach(console.log);
          break;

        default:
          break;
      }
    },
    [cursor, selection]
  );

  useWindowEvent("keydown", onKeyDown);

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  return (
    <form>
      <ol>
        {slice.map((key, index) => (
          <li key={key}>
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

function Header({ children }) {
  return (
    <header className="bg-flamingo-in-sunset sticky top-0 border-b border-flamingo/10 p-2">
      {children}
    </header>
  );
}

function Main({ children }) {
  return <main className="mb-2 p-2">{children}</main>;
}

function App() {
  const [error, setError] = useState(undefined);
  const [keys, setKeys] = useState(undefined);

  useEffect(() => {
    (async function load() {
      try {
        const result = await fetch("topstories.json");
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
