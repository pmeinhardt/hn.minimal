import * as factories from "../../__test-helpers__/factories";
import link from "./link";

describe("link", () => {
  it("returns the entry URL if present", () => {
    const entry = factories.story.build(); // stories have a "url" property
    expect(link(entry)).toBe(entry.url);
  });

  it("falls back to the URL on news.ycombinator.com", () => {
    const entry = factories.poll.build(); // polls have no "url" property
    expect(entry).not.toHaveProperty("url");

    const href = link(entry);
    expect(href).toBe(`https://news.ycombinator.com/item?id=${entry.id}`);
  });
});
