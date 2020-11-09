import { identity, subscribe } from "svelte/internal";
import { writable } from "svelte/store";

function readOrDefault(name, orElse) {
  let stored = localStorage.getItem(name);
  if (stored) {
    if (stored === "undefined") {
      return orElse;
    } else {
      return JSON.parse(stored);
    }
  }
}

export const page = writable({ page: "home" });

let user = localStorage.getItem("username");
user = user === "undefined" || user === "null" ? undefined : user;
export const username = writable(user);
username.subscribe((val) => localStorage.setItem("username", val));

export const courses = writable([]);

export const course = writable();

export const alerts = writable([]);
alerts.subscribe((a) => {
  if (a.length > 0) {
    setTimeout(
      () =>
        alerts.update((alerts) => {
          alerts.shift();
          return alerts;
        }),
      1500
    );
  }
});
export function sendAlert(message, type) {
  alerts.update((alert) => alert.concat({ message, type }));
}
export default {
  courses,
  username,
  page,
  course,
  alerts,
};
