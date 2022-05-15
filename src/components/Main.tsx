import React from "react";

export type Props = React.PropsWithChildren<never>;

function Main({ children }: Props) {
  return <main className="mb-2 px-4 py-2">{children}</main>;
}

export default Main;
