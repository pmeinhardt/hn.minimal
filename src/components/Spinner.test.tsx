import { render } from "@testing-library/react";

import Spinner from "./Spinner";

describe("Spinner", () => {
  function subject() {
    return render(<Spinner />);
  }

  it("renders a loading status message", () => {
    const screen = subject();

    const node = screen.getByRole("status");
    expect(node).toHaveTextContent("Loading…");
  });
});
