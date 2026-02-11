import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority: _priority, ...props }: Record<string, unknown>) => {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono" }),
}));
