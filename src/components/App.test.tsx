import { act, render, within } from "@testing-library/react";

import { id, times } from "../__test-helpers__/factories";
import { deferred } from "../__test-helpers__/promise";
import random from "../__test-helpers__/random";
import { get } from "../api";
import App from "./App";

jest.mock("../api", () => ({ get: jest.fn() }));

describe("App", () => {
  function subject() {
    return render(<App />);
  }

  beforeEach(() => {
    (get as jest.Mock).mockReset();
  });

  it("renders a loading indicator", async () => {
    const [promise, { resolve }] = deferred();
    (get as jest.Mock).mockReturnValue(promise);
    const screen = subject();

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveTextContent("Loading…");

    await act(async () => resolve([]));

    expect(spinner).not.toBeInTheDocument();
  });

  it("renders an error message", async () => {
    const [promise, { reject }] = deferred();
    (get as jest.Mock).mockReturnValue(promise);
    const screen = subject();

    const error = new Error("Big badaboom");
    await act(async () => reject(error));

    expect(screen.container).toHaveTextContent(error.message);
  });

  it("renders the list of stories", async () => {
    const [promise, { resolve }] = deferred();
    (get as jest.Mock).mockReturnValue(promise);
    const screen = subject();

    const count = random.natural({ min: 1, max: 6 });
    const ids = times(count, id);
    await act(async () => resolve(ids));

    const main = screen.getByRole("main");
    const list = within(main).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBe(ids.length);
  });
});
