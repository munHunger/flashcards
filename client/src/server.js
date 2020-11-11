import data from "./data";
let username = "";
export function init() {
  data.username.subscribe((val) => {
    username = val;
    function getCourses() {
      window
        .fetch("/courses", { headers: { username } })
        .then((res) => res.json())
        .then((res) => data.courses.set(res));
    }

    getCourses();
  });
}

export function getCourseTest(course) {
  window
    .fetch("/course/" + encodeURIComponent(course.name) + "/practice", {
      headers: { username },
    })
    .then((res) => res.json())
    .then((res) =>
      data.course.set({
        course: course.name,
        questions: res,
      })
    );
}

function saveCourse(course) {
  postData(
    "/course/" + encodeURIComponent(course.course) + "/updateUser",
    course.questions
  );
  console.log(course);
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      username,
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

export function getSettings(course) {
  window
    .fetch("/settings", { headers: { username } })
    .then((res) => res.json())
    .then((res) => {
      data.settings.set(res.courses.find((c) => c.name === course));
    });
}

export function saveSettings(settings) {
  let newSettings = {
    courses: [
      {
        name: settings.name,
        settings: {
          blacklist: settings.words
            .filter((word) => !word.enabled)
            .map((word) => word.rom),
        },
      },
    ],
  };
  fetch("/settings", {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      username,
    },
    body: JSON.stringify(newSettings), // body data type must match "Content-Type" header
  });
}

export default {
  init,
  getCourseTest,
  saveCourse,
  getSettings,
  saveSettings,
};
