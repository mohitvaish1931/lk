/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}
