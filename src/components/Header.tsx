import React from "react";

export type Props = React.PropsWithChildren<never>;

function Header({ children }: Props) {
  return (
    <header className="bg-flamingo-in-sunset sticky top-0 flex items-center justify-between gap-2 border-b border-flamingo/10 p-2">
      {children}
    </header>
  );
}

export default Header;
