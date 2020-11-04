import { subscribe } from "svelte/internal";
import { writable } from "svelte/store";

let storedConf = localStorage.getItem("config");
if (storedConf) {
  if (storedConf === "undefined") {
    storedConf = undefined;
  } else {
    storedConf = JSON.parse(storedConf);
  }
}
export const config = writable(storedConf);
config.subscribe((val) => localStorage.setItem("config", JSON.stringify(val)));

export const alerts = writable([]);

export const selectedCourse = writable();

alerts.subscribe((val) => {
  setTimeout(() => {
    alerts.update((alerts) => {
      alerts.shift();
      return alerts;
    });
  }, 10000);
});
