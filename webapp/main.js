import { createApp } from "vue";
import Main from "./main.vue";

export const getData = async () => {
  const response = await fetch("./data.json");

  return response.json();
};

const app = createApp(Main, { dataPromise: getData() });

app.mount("#app");
