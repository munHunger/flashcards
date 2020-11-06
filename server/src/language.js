const fs = require("fs");

let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

let lang = fs
  .readFileSync(path + "/grammar1.lang", "utf-8")
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

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function generate() {
  let format = shuffle(lang.format)[0];

  function expandTemplate(temp, lang, selector, dict = {}) {
    [...temp.matchAll(/{.+?}/gm)]
      .map((v) => new String(v))
      .forEach((v) => {
        let key = v.substring(1, v.length - 1);
        dict[key] = dict[key] || shuffle(lang[key])[0];
        temp = temp.replace(new RegExp(v, "g"), selector(dict[key]));
      });
    return temp;
  }
  let dict = {};
  format = {
    jp: expandTemplate(format.jp, lang, (word) => word.jp, dict),
    rom: expandTemplate(format.rom, lang, (word) => word.rom, dict),
    translations: format.translations.map((t) =>
      expandTemplate(t, lang, (word) => shuffle(word.translations)[0], dict)
    ),
  };
  return format;
}

module.exports = {
  generate: (count) => new Array(count).fill(0).map((_) => generate()),
};
