import data from "./data";
let username = "";
data.username.subscribe((val) => {
  username = val;
  function getCourses() {
    window
      .fetch("/courses", { headers: { username } })
      .then((res) => res.json())
      .then((res) => data.courses.set(res));
  }

  getCourses();
  console.log("server");
});

export function getCourseTest(course) {
  window
    .fetch("/course/" + encodeURIComponent(course.name) + "/test", {
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

export default {
  getCourseTest,
  saveCourse,
};
