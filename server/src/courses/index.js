const fs = require("fs");
const lang = require("./language");
const { getUser, saveUser } = require("./util");
module.exports = {
  init: (app) => {
    app.get("/settings", async (req, res) => {
      let user = getUser(req.headers.username);
      let courses = await Promise.all(
        lang.courses(user).map(async (course) => {
          return {
            name: course.name,
            words: (await course.rest.words(course, user)).map((word) => ({
              ...word,
              enabled:
                (
                  (
                    (user.courses.find((c) => course.name === c.name) || {})
                      .settings || {}
                  ).blacklist || []
                ).indexOf(word.rom) < 0,
            })),
          };
        })
      );
      user.courses = user.courses.map((course) => ({
        ...course,
        ...courses.find((c) => c.name === course.name),
      }));
      res.json(user);
    });

    app.put("/settings", (req, res) => {
      let user = getUser(req.headers.username);
      let courses = req.body.courses;
      courses.forEach((course) => {
        let c = user.courses.find((c) => c.name === course.name);
        c.settings = course.settings;
      });
      saveUser(user);
      res.json({ status: "ok" });
    });

    app.get("/courses", (req, res) => {
      res.json(
        lang.courses(getUser(req.headers.username)).map((c) => ({
          name: c.name,
          description: c.description,
          knowledge: c.knowledge,
        }))
      );
    });
    app.get("/course/:course", (req, res) => {
      let course = lang
        .courses(getUser(req.headers.username))
        .find((c) => c.name === req.params.course);
      res.json(Object.keys(course.rest));
    });
    app.get("/course/:course/:action", async (req, res) => {
      let course = lang
        .courses(getUser(req.headers.username))
        .find((c) => c.name === req.params.course);
      let user = getUser(req.headers.username);
      course.rest[req.params.action](course, user).then((data) => {
        res.json(data);
      });
    });
    app.post("/course/:course/:action", async (req, res) => {
      let course = lang
        .courses(getUser(req.headers.username))
        .find((c) => c.name === req.params.course);
      let user = getUser(req.headers.username);
      res.json(course.rest[req.params.action](course, user, req.body));
    });
  },
};
