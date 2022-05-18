import clsx from "clsx";
import { useMemo } from "react";

import href from "./link";
import type { Entry } from "./types";

export type Props = { data: Entry; highlighted: boolean };

function Item({ data, highlighted }: Props) {
  const host = useMemo(
    () => ("url" in data && data.url ? new URL(data.url).host : null),
    [data]
  );

  return (
    <div>
      <a
        href={href(data)}
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

export default Item;
