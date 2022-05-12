import ky from "https://cdn.skypack.dev/ky@0.30.0";
import Queue from "https://cdn.skypack.dev/p-queue@7.2.0";
import { Fragment, h, render } from "https://cdn.skypack.dev/preact@10.7.2";
import { useCallback, useEffect, useMemo, useReducer, useState } from "https://cdn.skypack.dev/preact@10.7.2/hooks";

const api = ky.create({ prefixUrl: "https://hacker-news.firebaseio.com/v0/" });

const fetch = (key) => api.get(key).json();

const queue = new Queue({ concurrency: 4 });

const cls = (...args) => args.filter(c => c).join(" ");

const pageSize = 30;

function Item({ data, highlighted }) {
  const host = useMemo(() => data.url && new URL(data.url).host, [data.url]);
  return h("div", { className: "ml2" }, [
    h("a", { href: data.url, className: cls("link dark-gray dim f5", highlighted && "red") }, data.title),
    highlighted && h("span", { className: "ml2 f7 gray" }, host),
  ]);
}

function List({ keys }) {
  const [size, setSize] = useState(Math.min(pageSize, keys.length));
  const [data, add] = useReducer((prev, [key, item]) => ({ ...prev, [key]: item }), {});

  const slice = useMemo(() => keys.slice(0, size), [keys, size]);

  useEffect(() => {
    slice.filter((key) => !(key in data)).forEach((key) => {
      queue.add(async () => {
        const result = await fetch(`item/${key}.json`);
        add([key, result]);
      });
    });
  }, [size]);

  const [selection, setSelection] = useState({});
  const [cursor, setCursor] = useState(undefined);

  const onKeyDown = useCallback((event) => {
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
        const key = keys[cursor];
        setSelection({ ...selection, [key]: !selection[key] });
        break;

      case "o": // open
        const items = Object.entries(selection)
          .filter(([, selected]) => selected)
          .map(([key]) => data[key]);
        console.log(items);
        break;
    }
  }, [cursor, selection]);

  const reveal = useCallback(() => {
    setSize(Math.min(size + pageSize, keys.length));
  }, [keys, size]);

  return h("form", { onKeyDown }, [
    h("ol", { className: "list ma0 pa0" }, slice.map((key, index) => h("li", { key }, [
      h("div", { className: cls("flex items-stretch bb b--light-gray", index === cursor && "b") }, [
        h("label", { className: "flex items-center ph2 pv3" }, [
          h("input", { type: "checkbox", checked: selection[key], onChange: () => {/* TODO */} }),
          h("span", { className: "w3ch ml2 f7 tr gray" }, `${index + 1}`),
          key in data ? h(Item, { data: data[key], highlighted: index === cursor }) : "…",
        ]),
      ]),
    ]))),
    h("button", { type: "button", onClick: reveal }, "More"),
  ]);
}

function Header({ children }) {
  return h("header", { className: "sticky top-0 pa2 bg-gradient near-white bb b--header" }, children);
}

function Main({ children }) {
  return h("main", { className: "mb2 pa2" }, children);
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

  if (loading) return h("strong", null, "Loading…");
  if (error) return h("strong", null, "Oops!");

  return h(Fragment, null, [
    h(Header, null, [h("h1", { className: "f3 ma0 ph2 ts-primary" }, "hn")]),
    h(Main, null, [h(List, { keys })]),
  ]);
}

const app = h(App);

render(app, document.body);
