import { render } from "@testing-library/react";

import type { Props } from "./Main";
import Main from "./Main";

describe("Main", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { children: null };
    const props = { ...defaults, ...overrides };
    return render(<Main {...props} />);
  }

  it("renders child elements", () => {
    const children = <span data-testid="child-testid" />;
    const screen = subject({ children });

    const node = screen.getByTestId("child-testid");
    expect(node).toBeInTheDocument();
  });
});
