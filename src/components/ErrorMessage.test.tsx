import { render } from "@testing-library/react";

import random from "../__test-helpers__/random";
import type { Props } from "./ErrorMessage";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { error: new Error("Ouch!") };
    const props = { ...defaults, ...overrides };
    return render(<ErrorMessage {...props} />);
  }

  it("renders the error message", () => {
    const error = new Error(random.sentence({ words: 3 }));
    const screen = subject({ error });

    expect(screen.container).toHaveTextContent(error.message);
  });
});
