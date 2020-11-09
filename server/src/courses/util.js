const fs = require("fs");

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

function expandTemplate(temp, lang, selector, dict = {}) {
  [...temp.matchAll(/{.+?}/gm)]
    .map((v) => new String(v))
    .forEach((v) => {
      let key = v.substring(1, v.length - 1).split(":");
      let lookup = shuffle(
        (key[1] || "")
          .split("|")
          .map((part) => lang[part])
          .reduce((acc, val) => acc.concat(val), [])
      )[0];
      dict[key[0]] = dict[key[0]] || lookup;
      key = [...v.matchAll(/(?<={).+?(?=(}|:))/g)][0][0];
      temp = temp.replace(
        new RegExp(`{${key}(.*?)}`, "g"),
        selector(dict[key[0]])
      );
    });
  return temp;
}

function getUser(name) {
  let path = "data";

  process.argv.forEach((line) => {
    if (line.split("=")[0] === "data") path = line.split("=")[1];
  });
  path += `/users/${name}.json`;
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function saveUser(user) {
  let path = "data";

  process.argv.forEach((line) => {
    if (line.split("=")[0] === "data") path = line.split("=")[1];
  });
  path += `/users/${user.username}.json`;
  fs.writeFileSync(path, JSON.stringify(user, null, 2), "utf-8");
}

module.exports = { shuffle, expandTemplate, getUser, saveUser };
