import ky from "ky";
import Queue from "p-queue";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { createRoot } from "react-dom/client";

const api = ky.create({ prefixUrl: "https://hacker-news.firebaseio.com/v0/" });

const fetch = (key) => api.get(key).json();

const queue = new Queue({ concurrency: 4 });

const cls = (...args) => args.filter((c) => c).join(" ");

const pageSize = 30;

function Loader() {
  return (
    <div className="flex gap-1">
      <div className="animate-bounce bg-stone-300 w-2 h-2 rounded-full" />
      <div className="animate-bounce animate-delay-200 bg-stone-300 w-2 h-2 rounded-full" />
      <div className="animate-bounce animate-delay-400 bg-stone-300 w-2 h-2 rounded-full" />
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

  const onKeyDown = useCallback(
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

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  return (
    <form onKeyDown={onKeyDown}>
      <ol>
        {slice.map((key, index) => (
          <li key={key}>
            <div
              className={cls(
                "flex items-stretch border-b border-stone-200",
                index === cursor && "b"
              )}
            >
              <label className="flex items-center gap-2 px-2 py-3">
                <input
                  className="accent-cyan-600"
                  type="checkbox"
                  checked={selection[key]}
                  onChange={() => {
                    /* TODO */
                  }}
                />
                <span className="flex-none w-3ch text-xs text-center text-stone-400">
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
    <header className="sticky top-0 border-b border-flamingo/10 p-2 bg-flamingo-in-sunset">
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

  if (loading) return <strong>Loading…</strong>;
  if (error) return <strong>Oops!</strong>;

  return (
    <>
      <Header>
        <h1 className="px-2 text-2xl text-stone-100 font-bold text-shadow-flamingo/20">
          hn
        </h1>
      </Header>
      <Main>
        <List keys={keys} />
      </Main>
    </>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(<App />);
