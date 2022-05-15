import React, { useEffect, useState } from "react";

import { get } from "../api";
import Header from "./Header";
import List from "./List";
import Main from "./Main";
import Spinner from "./Spinner";

export type Props = never;

function App(/* _: Props */) {
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

  return (
    <>
      <Header>
        <h1 className="text-2xl font-bold">hn</h1>
        {keys && (
          <div className="font-mono text-xs">
            <ul className="flex gap-5">
              <li>
                <kbd>j</kbd> ↓
              </li>
              <li>
                <kbd>k</kbd> ↑
              </li>
              <li>
                <kbd>x</kbd> ✓
              </li>
              <li>
                <kbd>o</kbd> ▹
              </li>
            </ul>
          </div>
        )}
      </Header>
      <Main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {keys ? (
          <List keys={keys} />
        ) : error ? (
          <strong>Oops!</strong>
        ) : (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </Main>
    </>
  );
}

export default App;
