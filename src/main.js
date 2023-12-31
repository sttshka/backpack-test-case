import "./assets/main.css";

import { createApp } from "vue";
import { plugin as VueTippy } from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(VueTippy, {
  directive: "tippy",
  defaultProps: {
    followCursor: true,
    placement: "auto-end",
    arrow: false,
    hideOnClick: false,
  },
});
app.use(router);

app.mount("#app");
