// NOTE: This is a documentation-only example.
// These imports will work in a real React TypeScript project.
import React from "react";
// @ts-ignore - react-dom is not installed because this is a demo
import ReactDOM from "react-dom/client";

import Router from "./Router";

ReactDOM?.createRoot?.(
  document.getElementById("root") as HTMLElement
)?.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
