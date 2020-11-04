const fs = require("fs");

let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

let hiragana = fs
  .readFileSync(path + "/hiragana.csv", "utf-8")
  .split("\n")
  .map((line) => {
    let parts = line.split(";");
    return {
      jp: parts[0],
      rom: parts[1],
    };
  });

module.exports = { hiragana };
