import { useEffect, useRef, useState } from "react";

import { get } from "../api";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
import List from "./List";
import Main from "./Main";
import Spinner from "./Spinner";

export type Props = never;

function App(/* _: Props */) {
  const [error, setError] = useState(undefined);
  const [keys, setKeys] = useState(undefined);

  const marquee = useRef();

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
        <div ref={marquee} />
      </Header>
      <Main>
        {/* eslint-disable-next-line no-nested-ternary */}
        {keys ? (
          <List marquee={marquee.current} keys={keys} />
        ) : error ? (
          <div className="py-4">
            <ErrorMessage error={error} />
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
