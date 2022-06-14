# hn.minimal

_a minimal Hacker News client tailored to my reading habits 🪡_

- stories do not shift over time as you navigate through pages ⚓️
- select interesting stories first, then open them all in tabs for reading ✏️
- keyboard controls ⌨️

_Note: This is a little side-project I dabbled in with half a 🧠 for some exploration and prototyping. It does not quite reflect the amount of care I would pour into any serious project._

## Prerequisites

Be sure to have a recent version of [Node.js](https://nodejs.dev/learn/how-to-install-nodejs) installed (i.e. Node.js 16+).

## Getting started

To install dependencies, run:

```bash
npm install
```

Then, to start the development server:

```bash
npm start
```

Open your browser and point it to the server address.

## Development tasks

To run the tests:

```bash
npm test            # or:
npm test -- --watch # to automatically re-run whenever a file changes
```

Test data generation is randomized. When you encounter a test failure, use the `SEED` value printed at the start of the test run to reproduce it: `SEED=… npm test`.

To check code for consistent formatting and potential issues:

```bash
npm run lint
```

## References

- **Hacker News API**: https://github.com/HackerNews/API
