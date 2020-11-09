const fs = require("fs");
const lang = require("./language");
const { getUser } = require("./util");
module.exports = {
  init: (app) => {
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
    app.get("/course/:course/:action", (req, res) => {
      let course = lang
        .courses(getUser(req.headers.username))
        .find((c) => c.name === req.params.course);
      let user = getUser(req.headers.username);
      res.json(course.rest[req.params.action](course, user));
    });
    app.post("/course/:course/:action", (req, res) => {
      let course = lang
        .courses(getUser(req.headers.username))
        .find((c) => c.name === req.params.course);
      let user = getUser(req.headers.username);
      res.json(course.rest[req.params.action](course, user, req.body));
    });
  },
};
