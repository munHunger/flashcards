const fs = require("fs");

let kanji = fs
  .readFileSync(__dirname + "/../data/Kanji_20201022_101129.csv", "utf-8")
  .split("\n")
  .slice(1)
  .map((row) => {
    let parts = row.split(";");
    //id;Kanji;Strokes;JLPT-test;"Reading within Joyo";"Translation of On"
    return {
      id: parts[0],
      kanji: parts[1],
      strokes: parts[2],
      jlpt: parts[3],
      joyo: parts[4],
      translation: (parts[5] || "")
        .match(/[\w\s]*/g)
        .filter((t) => t.length > 0)
        .map((translation) => translation.trim()),
    };
  })
  .filter((kanji) => kanji);
console.log(
  kanji
    .map((k) => parseInt(k.jlpt))
    .filter((v) => v)
    .reduce((acc, val) => Math.min(acc, val), 999)
);

console.log(
  kanji
    .map((k) => parseInt(k.jlpt))
    .filter((v) => v)
    .reduce((acc, val) => Math.max(acc, val), 0)
);
module.exports = { kanji };
