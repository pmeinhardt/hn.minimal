import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export type Props = { children: ReactNode; container: Element };

function Hints({ children, container }: Props) {
  return container ? createPortal(children, container) : null;
}

export default Hints;
