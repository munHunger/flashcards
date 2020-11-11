import App from "./App.svelte";

const app = new App({
  target: document.body,
  intro: true,
  props: {
    name: "world",
  },
});

import server from "./server";
server.init();
export default app;
