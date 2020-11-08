import { subscribe } from "svelte/internal";
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

export const kanji = writable({
  本: { known: false, rom: "hon" },
  日: { known: true },
  人: { known: true },
  先: { known: false },
  月: { known: false },
});

export const page = writable({ page: "profile" });

export const config = writable(readOrDefault("config", undefined));
config.subscribe((val) => localStorage.setItem("config", JSON.stringify(val)));

export const alerts = writable([]);

export const profile = writable(readOrDefault("profile", {}));
profile.subscribe((val) => {
  console.log("writing to profile storage");
  console.log(val);
  localStorage.setItem("profile", JSON.stringify(val));
});

export const selectedCourse = writable();

alerts.subscribe((val) => {
  setTimeout(() => {
    alerts.update((alerts) => {
      alerts.shift();
      return alerts;
    });
  }, 10000);
});
