import '@testing-library/jest-dom';

// Polyfill DOMMatrix for pdfjs-dist in jsdom
if (typeof window !== 'undefined' && !window.DOMMatrix) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}
