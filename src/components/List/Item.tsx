import clsx from "clsx";
import { useMemo } from "react";

import type { Entry } from "../../types";
import href from "./link";

// For some reason ESLint reports an issue here even though we provide a default.
// eslint-disable-next-line react/require-default-props
export type Props = { data: Entry; highlighted?: boolean };

function Item({ data, highlighted = false }: Props) {
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
