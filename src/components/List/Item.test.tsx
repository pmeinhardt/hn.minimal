import { render } from "@testing-library/react";

import * as factories from "../../__test-helpers__/factories";
import type { Props } from "./Item";
import Item from "./Item";

describe("Item", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { data: factories.entry.build() };
    const props = { ...defaults, ...overrides };
    return render(<Item {...props} />);
  }

  it("renders the entry title", () => {
    const data = factories.entry.build();
    const screen = subject({ data });

    const link = screen.getByRole("link");
    expect(link).toHaveTextContent(data.title);
  });

  it("links to the entry URL", () => {
    const data = factories.story.build();
    const screen = subject({ data });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", data.url);
  });

  it("shows the domain for the entry", () => {
    const url = "https://blog.github.com/2022-05-26";
    const data = factories.story.build({ url });
    const screen = subject({ data });

    expect(screen.container).toHaveTextContent("blog.github.com");
  });
});
