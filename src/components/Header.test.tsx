import { render } from "@testing-library/react";

import type { Props } from "./Header";
import Header from "./Header";

describe("Header", () => {
  function subject(overrideProps: Partial<Props>) {
    const defaultProps: Props = { children: null };
    const props = { ...defaultProps, ...overrideProps };
    return render(<Header {...props} />);
  }

  it("renders child elements", () => {
    const children = <span data-testid="child-testid" />;
    const screen = subject({ children });

    const node = screen.getByTestId("child-testid");
    expect(node).toBeInTheDocument();
  });
});
