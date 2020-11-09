const fs = require("fs");
const {
  shuffle,
  expandTemplate,
  saveUser,
  getUser,
  permutation,
} = require("./util");
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
    jp: expandTemplate(format.jp, lang, dict).reduce(
      (acc, val) => acc + (val.jp || val),
      ""
    ),
    rom: expandTemplate(format.rom, lang, dict).reduce(
      (acc, val) => acc + (val.rom || val),
      ""
    ),
    translations: shuffle(
      format.translations
        .map((t) =>
          permutation(
            expandTemplate(t, lang, dict).map(
              (part) => part.translations || [part]
            )
          )
        )
        .reduce((acc, val) => acc.concat(val), [])
    ),
    words: Object.values(dict),
  };
  return format;
}

function calcKnowledge(user, courseName) {
  let progress = (
    user.courses.find((course) => course.name === courseName) || {}
  ).progress;
  if (!progress) return undefined;
  let rate = progress.practice.pass / progress.practice.attempts;
  if (rate > 0.75) return "very good";
  if (rate > 0.5) return "moderate";
  return "poor";
}
let rest = {
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
    let words = course.rest.words(course, user);
    console.log(words);
    return new Array(15)
      .fill(0)
      .map((_) => generate(course.language))
      .map((test) => {
        test.words = test.words.map((word) => ({
          ...word,
          ...words.find((w) => w.rom === word.rom),
        }));
        return test;
      });
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
    course.progress.practice.pass += success / results.length >= 0.75 ? 1 : 0;
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
  test: (course, user) => {
    return course.rest.practice(course, user); //TODO: this sucks
  },
};
let courses = (user) => [
  {
    name: "First grammar course",
    description: "Learn basic grammar on the format {x is/was y}",
    knowledge: calcKnowledge(user, "First grammar course"),
    language: readLanguage(path + "/grammar1.lang"),
    rest,
  },
  {
    name: "Kanji 1",
    description: "The beggining of a new world of kanji and moon runes",
    knowledge: calcKnowledge(user, "Kanji1"),
    language: readLanguage(path + "/kanji1.lang"),
    rest,
  },
];

module.exports = {
  courses,
};
