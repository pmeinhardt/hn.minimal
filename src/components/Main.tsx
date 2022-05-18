import type { PropsWithChildren } from "react";

export type Props = PropsWithChildren<never>;

function Main({ children }: Props) {
  return <main className="mb-2 px-4 py-2">{children}</main>;
}

export default Main;
