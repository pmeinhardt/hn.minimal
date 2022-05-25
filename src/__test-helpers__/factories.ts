import { Factory } from "fishery";

import type { Ask, Entry, Job, Poll, Story } from "../types";
import random from "./random";

export const times = <T>(n: number, fn: () => T): T[] => random.n(fn, n);

export const sequence = (start: number) => {
  let n = start;
  return () => n++; // eslint-disable-line no-plusplus
};

export const id = sequence(10000);

const score = () => random.natural({ max: 1000 });
const text = () => random.paragraph();
const time = () => random.timestamp();
const title = () => random.sentence();
const url = () => random.url({ protocol: "https" });
const username = () => random.first().toLowerCase();

export const ask = Factory.define<Ask>(() => {
  const n = random.natural({ max: 5 });

  return {
    by: username(),
    descendants: n,
    id: id(),
    kids: random.n(id, n),
    score: score(),
    text: text(),
    time: time(),
    title: title(),
    type: "story",
  };
});

export const job = Factory.define<Job>(() => ({
  by: username(),
  id: id(),
  score: score(),
  text: text(),
  time: time(),
  title: title(),
  type: "job",
  url: url(),
}));

export const poll = Factory.define<Poll>(() => {
  const n = random.natural({ max: 5 });

  return {
    by: username(),
    descendants: n,
    id: id(),
    kids: random.n(id, n),
    parts: random.n(id, random.natural({ max: 3 })),
    score: score(),
    text: text(),
    time: time(),
    title: title(),
    type: "poll",
  };
});

export const story = Factory.define<Story>(() => {
  const n = random.natural({ max: 5 });

  return {
    by: username(),
    descendants: n,
    id: id(),
    kids: random.n(id, n),
    score: score(),
    time: time(),
    title: title(),
    type: "story",
    url: url(),
  };
});

export const entry = Factory.define<Entry>(() => {
  const factory = random.pickone([ask, job, poll, story]);
  return factory.build();
});
