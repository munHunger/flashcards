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

function expandTemplate(temp, lang, dict = {}) {
  let parts = temp.split(/{|}/).map((part, index) => {
    if (index % 2 === 0) return part;
    let key = part.split(":");
    let lookup = shuffle(
      (key[1] || "")
        .split("|")
        .map((part) => lang[part])
        .reduce((acc, val) => acc.concat(val), [])
    )[0];
    dict[key[0]] = dict[key[0]] || lookup;
    return dict[key[0]];
  });
  return parts;
}

function permutation(lists, acc = [""]) {
  if (lists.length === 0) return;
  if (lists.length === 1) {
    return lists[0]
      .map((val) => acc.map((other) => val + other))
      .reduce((acc, val) => acc.concat(val), []);
  }
  return permutation([lists[0]], permutation(lists.slice(1), acc));
}

function newUser(name) {
  return { username: name, words: [], courses: [] };
}

function getUser(name) {
  let path = "data";

  process.argv.forEach((line) => {
    if (line.split("=")[0] === "user") path = line.split("=")[1];
  });
  path += `/users/${name}.json`;
  if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path, "utf-8"));
  let user = newUser(name);
  saveUser(user);
  return user;
}

function saveUser(user) {
  let path = "data";

  process.argv.forEach((line) => {
    if (line.split("=")[0] === "user") path = line.split("=")[1];
  });
  path += `/users/${user.username}.json`;
  fs.writeFileSync(path, JSON.stringify(user, null, 2), "utf-8");
}

function unique(list) {
  return [...new Set(list)]
}

function requireOptions(options, list) {
  let missing = options.filter(op => list.indexOf(op) === -1)
  let length = list.length;
  return missing.concat(list).slice(0, Math.max(length, options.length));
}

module.exports = { shuffle, expandTemplate, getUser, saveUser, permutation, unique, requireOptions };
