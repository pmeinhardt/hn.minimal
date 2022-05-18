import type { PropsWithChildren } from "react";

export type Props = PropsWithChildren<never>;

function Header({ children }: Props) {
  return (
    <header className="bg-flamingo-in-sunset text-shadow-flamingo/20 sticky top-0 border-b border-flamingo/10 px-4 py-2 text-stone-100">
      <div className="flex items-center justify-between gap-2">{children}</div>
    </header>
  );
}

export default Header;
