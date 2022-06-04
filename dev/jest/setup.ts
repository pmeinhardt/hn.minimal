import "@testing-library/jest-dom";

// Stub `scrollIntoView()` which is not implemented in jsdom.
// https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = () => undefined;
