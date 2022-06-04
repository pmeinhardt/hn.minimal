import { act, fireEvent, render, within } from "@testing-library/react";
import map from "lodash/map";
import zip from "lodash/zip";

import * as factories from "../__test-helpers__/factories";
import { deferred } from "../__test-helpers__/promise";
import { get } from "../api";
import type { Props } from "./List";
import List from "./List";
import href from "./List/link";

jest.mock("../api", () => ({ get: jest.fn() }));

function defer<T = unknown>(count: number, fn: jest.Mock<Promise<T>>) {
  const actions = new Array(count);
  const at = (index: number) => actions[index];

  for (let i = 0; i < count; i += 1) {
    const [promise, ops] = deferred<T>();
    fn.mockReturnValueOnce(promise);
    actions[i] = ops;
  }

  return {
    resolve: (index: number, value: T) => at(index).resolve(value),
    reject: (index: number, reason: any) => at(index).reject(reason),
  };
}

const mockGet = get as jest.Mock;
const mockOpen = jest.spyOn(window, "open");

const pageSize = 15;

describe("List", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = {
      ids: [],
      marquee: document.createElement("div"),
    };
    const props = { ...defaults, ...overrides };
    return render(<List {...props} />);
  }

  function press(key: string) {
    fireEvent.keyDown(document, { key });
  }

  beforeEach(() => {
    mockGet.mockReset();
    mockOpen.mockReset();
  });

  it("loads and renders entries", async () => {
    const entries = factories.entry.buildList(4);
    const ids = map(entries, "id");
    const { resolve } = defer(entries.length, mockGet);

    const screen = subject({ ids });

    await act(async () => entries.forEach((e, i) => resolve(i, e)));

    const items = screen.getAllByRole("listitem");
    zip(entries, items).forEach(([entry, item]) => {
      expect(item).toHaveTextContent(entry.title);
    });
  });

  it("paginates entries", async () => {
    const entries = factories.entry.buildList(pageSize + 3);
    const ids = map(entries, "id");
    const { resolve } = defer(entries.length, mockGet);

    const screen = subject({ ids });

    const page1 = entries.slice(0, pageSize);
    const page2 = entries.slice(pageSize);

    await act(async () => page1.forEach((e, i) => resolve(i, e)));

    expect(get).toHaveBeenCalledTimes(page1.length);

    act(() => {
      const button = screen.getByRole("button", { name: "Show more" });
      fireEvent.click(button);
    });

    await act(async () => {
      page2.forEach((e, i) => resolve(page1.length + i, e));
    });

    expect(get).toHaveBeenCalledTimes(page1.length + page2.length);

    const items = screen.getAllByRole("listitem");
    zip(entries, items).forEach(([entry, item]) => {
      expect(item).toHaveTextContent(entry.title);
    });
  });

  it("allows selecting entries to open them", async () => {
    const entries = factories.entry.buildList(4);
    const ids = map(entries, "id");
    const { resolve } = defer(entries.length, mockGet);

    const screen = subject({ ids });

    await act(async () => entries.forEach((e, i) => resolve(i, e)));

    const items = screen.getAllByRole("listitem");
    const selection = [1, 2];

    act(() => {
      selection.forEach((index) => {
        const item = items[index];
        const checkbox = within(item).getByRole("checkbox");
        fireEvent.click(checkbox);
      });
    });

    act(() => {
      const button = screen.getByRole("button", {
        name: "Open selected entries",
      });
      fireEvent.click(button);
    });

    expect(mockOpen.mock.calls).toEqual(
      selection.map((index) => [href(entries[index]), "_blank"])
    );
  });

  it("supports keyboard navigation", async () => {
    const entries = factories.entry.buildList(4);
    const ids = map(entries, "id");
    const { resolve } = defer(entries.length, mockGet);

    const screen = subject({ ids });

    await act(async () => entries.forEach((e, i) => resolve(i, e)));

    ["j", "x", "j", "j", "x"].forEach(press);

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByRole("checkbox")).toBeChecked();
    expect(within(items[2]).getByRole("checkbox")).toBeChecked();

    press("o");

    expect(mockOpen).toHaveBeenCalledWith(href(entries[0]), "_blank");
    expect(mockOpen).toHaveBeenCalledWith(href(entries[2]), "_blank");
    expect(mockOpen).toHaveBeenCalledTimes(2);

    press("e");

    expect(within(items[0]).getByRole("checkbox")).not.toBeChecked();
    expect(within(items[2]).getByRole("checkbox")).not.toBeChecked();
  });
});
