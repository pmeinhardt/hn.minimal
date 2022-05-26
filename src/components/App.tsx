import { useEffect, useRef, useState } from "react";

import { get } from "../api";
import type { ID } from "../types";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
import List from "./List";
import Main from "./Main";
import Spinner from "./Spinner";

const reload = () => window.location.reload();

export type Props = never;

function App(/* _: Props */) {
  const [error, setError] = useState<Error>();
  const [ids, setIds] = useState<ID[]>();

  const marquee = useRef();

  useEffect(() => {
    (async function load() {
      try {
        const result = await get("topstories.json");
        setIds(result as ID[]);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  return (
    <>
      <Header>
        <h1 className="text-2xl font-bold">hn</h1>
        <div ref={marquee} />
      </Header>
      <Main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {ids ? (
          <List ids={ids} marquee={marquee.current} />
        ) : error ? (
          <div className="py-4">
            <ErrorMessage error={error} />
            <button type="button" onClick={reload}>
              Try again
            </button>
          </div>
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
