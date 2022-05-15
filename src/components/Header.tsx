import React from "react";

export type Props = React.PropsWithChildren<never>;

function Header({ children }: Props) {
  return (
    <header className="bg-flamingo-in-sunset text-shadow-flamingo/20 sticky top-0 border-b border-flamingo/10 p-2 text-stone-100">
      <div className="flex items-center justify-between gap-2 px-2">
        {children}
      </div>
    </header>
  );
}

export default Header;
