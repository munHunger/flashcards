const fs = require("fs");
const {
  shuffle,
  expandTemplate,
  saveUser,
  getUser,
  permutation,
  unique,
  requireOptions,
} = require("./util");
const { voice } = require("../voice");
let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

function readLanguage(path) {
  return fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .filter((v) => v.trim().length > 0)
    .reduce((acc, val) => {
      var count = (val.match(/    /g) || []).length;
      if (count === 0) {
        acc[val] = [];
      } else if (count === 1) {
        let keys = Object.keys(acc);
        let key = keys[keys.length - 1];
        let parts = val.trim().split(";");
        acc[key].push({
          jp: parts[0],
          rom: parts[1],
          translations: parts[2].split("|"),
        });
      } else if (count === 2) {
        let keys = Object.keys(acc);
        let key = keys[keys.length - 1];
        acc[key][acc[key].length - 1].info = val.trim();
      }
      return acc;
    }, {});
}

function generate(lang, blacklist = []) {
  let format = shuffle(lang.format)[0];

  Object.keys(lang).forEach((key) => {
    lang[key] = lang[key].filter((word) => blacklist.indexOf(word.rom) == -1);
  });
  let dict = {};
  format = {
    jp: expandTemplate(format.jp, lang, dict).reduce(
      (acc, val) => acc + (val.jp || val),
      ""
    ),
    wordOptions: shuffle(
      requireOptions(
        [
          ...Object.values(dict).map((val) => val.jp),
          ...expandTemplate(format.jp, lang, dict).filter(
            (part) => typeof part === "string"
          ).filter(v => v.length > 0),
        ],
        shuffle(
          unique(
            lang.format
              .map((format) =>
                expandTemplate(format.jp, lang, dict).filter(
                  (w) => typeof w === "string"
                )
              )
              .concat(
                Object.keys(lang)
                  .filter((key) => key !== "format")
                  .map((key) => lang[key].map((word) => word.jp))
              )
              .reduce((acc, val) => acc.concat(val), [])
              .filter((v) => v.length > 0)
          )
        ).slice(0, 12)
      )
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
    info: expandTemplate(format.info || "", lang, dict).reduce(
      (acc, val) => acc + ((val.translations || [])[0] || val),
      ""
    ),
    words: Object.values(dict),
  };
  return format;
}
console.log(generate(readLanguage("data/grammar2.lang")));

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
  words: async (course, user) => {
    return Object.keys(course.language)
      .filter((key) => key !== "format")
      .map((key) => course.language[key])
      .reduce((acc, val) => acc.concat(val), [])
      .map((word) => ({
        ...word,
        ...user.words.find((w) => w.rom === word.rom),
      }));
  },
  practice: async (course, user) => {
    let words = await course.rest.words(course, user);
    let blacklist =
      ((user.courses.find((c) => c.name === course.name) || {}).settings || {})
        .blacklist || [];
    let values = new Array(15)
      .fill(0)
      .map((_) => generate(course.language, blacklist))
      .map((test) => {
        test.words = test.words.map((word) => ({
          ...word,
          ...(words || []).find((w) => w.rom === word.rom),
        }));
        return voice(test.jp, test.rom).then(() => {
          return test;
        });
      });
    return Promise.all(values);
  },
  updateUser: (inputCourse, user, results) => {
    let course = user.courses.find((c) => c.name === inputCourse.name);
    if (!course) {
      course = {
        name: inputCourse.name,
        progress: {
          practice: {
            pass: 0,
            attempts: 0,
          },
        },
        settings: {
          blacklist: [],
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
};
let courses = (user) => [
  {
    name: "First grammar course",
    description: "Partikeln ha, desu-grejer, noun-kombination",
    knowledge: calcKnowledge(user, "First grammar course"),
    language: readLanguage(path + "/grammar1.lang"),
    rest,
  },
  {
    name: "Second grammar course",
    description: "Advanced stuff",
    knowledge: calcKnowledge(user, "Second grammar course"),
    language: readLanguage(path + "/grammar2.lang"),
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
