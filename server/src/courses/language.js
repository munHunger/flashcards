const fs = require("fs");
const { shuffle, expandTemplate, saveUser, getUser } = require("./util");
let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

function readLanguage(path) {
  return fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .filter((v) => v.length > 0)
    .reduce((acc, val) => {
      if (!val.startsWith(" ")) {
        acc[val] = [];
      } else {
        let keys = Object.keys(acc);
        let key = keys[keys.length - 1];
        let parts = val.trim().split(";");
        acc[key].push({
          jp: parts[0],
          rom: parts[1],
          translations: parts[2].split("|"),
        });
      }
      return acc;
    }, {});
}

function generate(lang) {
  let format = shuffle(lang.format)[0];

  let dict = {};
  format = {
    jp: expandTemplate(format.jp, lang, (word) => word.jp, dict),
    rom: expandTemplate(format.rom, lang, (word) => word.rom, dict),
    translations: format.translations.map((t) =>
      expandTemplate(t, lang, (word) => shuffle(word.translations)[0], dict)
    ),
    words: Object.values(dict),
  };
  return format;
}

function calcKnowledge(user) {
  let progress = (
    user.courses.find((course) => course.name === "First grammar course") || {}
  ).progress;
  if (!progress) return undefined;
  let rate = progress.practice.pass / progress.practice.attempts;
  if (rate > 0.75) return "very good";
  if (rate > 0.5) return "moderate";
  return "poor";
}

let courses = (user) => [
  {
    name: "First grammar course",
    description: "Learn basic grammar on the format {x is/was y}",
    knowledge: calcKnowledge(user),
    language: readLanguage(path + "/grammar1.lang"),
    rest: {
      words: (course, user) => {
        return Object.keys(course.language)
          .filter((key) => key !== "format")
          .map((key) => course.language[key])
          .reduce((acc, val) => acc.concat(val), [])
          .map((word) => ({
            ...word,
            ...user.words.find((w) => w.rom === word.rom),
          }));
      },
      practice: (course, user) => {
        return new Array(15).fill(0).map((_) => generate(course.language));
      },
      updateUser: (_, user, results) => {
        let course = user.courses.find(
          (course) => course.name === "First grammar course"
        );
        if (!course) {
          course = {
            name: "First grammar course",
            progress: {
              practice: {
                pass: 0,
                attempts: 0,
              },
            },
          };
          user.courses.push(course);
        }

        let success = results.filter((r) => r.success).length;
        course.progress.practice.pass +=
          success / results.length >= 0.75 ? 1 : 0;
        course.progress.practice.attempts += 1;

        results.forEach((res) => {
          res.words.forEach((word) => {
            let known = user.words.find((known) => known.rom === word.rom);
            if (!known) {
              known = {
                jp: word.jp,
                rom: word.rom,
                translations: word.translations,
                progress: {
                  hiragana: {
                    pass: 0,
                    attempts: 0,
                  },
                },
              };
              user.words.push(known);
            }
            known.progress.hiragana.pass += res.success ? 1 : 0;
            known.progress.hiragana.attempts += 1;
          });
        });

        saveUser(user);

        return user;
      },
      test: (course) => {
        return new Array(15).fill(0).map((_) => generate(course.language));
      },
    },
  },
];

module.exports = {
  courses,
};
