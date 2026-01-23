import { createRoot } from "react-dom/client";
import { App } from "./Layout";

function start() {
  const root = createRoot(document.body);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
