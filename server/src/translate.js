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
      rom: parts[1].split(", ")[0],
    };
  });

function translateHiraganaToRom(word, acc = "") {
  if (word.length === 0) return acc;
  let comb = word.substring(0, 2);
  let sym = hiragana.find((sym) => sym.jp === comb);
  if (sym) {
    acc += sym.rom;
    return translateHiraganaToRom(word.substring(2), acc);
  }

  let single = word.substring(0, 1);
  acc += hiragana.find((sym) => sym.jp === single).rom;
  return translateHiraganaToRom(word.substring(1), acc);
}
module.exports = { hiragana, translateHiraganaToRom };
