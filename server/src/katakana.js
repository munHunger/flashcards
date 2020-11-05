const fs = require("fs");

let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

let katakana = fs
  .readFileSync(path + "/katakana.csv", "utf-8")
  .split("\n")
  .map((line) => {
    let parts = line.split(";");
    return {
      jp: parts[0],
      rom: parts[1],
    };
  });
let katakanaWords = fs
  .readFileSync(path + "/katakanaWords.csv", "utf-8")
  .split("\n")
  .map((line) => {
    let parts = line.split(";");
    return {
      jp: parts[1],
      rom: parts[0],
    };
  });

module.exports = { katakana, katakanaWords };
