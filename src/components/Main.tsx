import type { ReactNode } from "react";

export type Props = { children: ReactNode };

function Main({ children }: Props) {
  return <main className="mb-2 px-4 py-2">{children}</main>;
}

export default Main;
