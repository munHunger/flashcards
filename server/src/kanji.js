const fs = require("fs");

let path = "data";

process.argv.forEach((line) => {
  if (line.split("=")[0] === "data") path = line.split("=")[1];
});

let kanji = fs
  .readFileSync(path + "/Kanji_20201022_101129.csv", "utf-8")
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

let words = fs
  .readFileSync(path + "/Jukugo_20201022_101219.csv", "utf-8")
  .split("\n")
  .slice(1)
  .map((row) => {
    let parts = row.split(";");
    //id;"Comp. Word";Frequency;"Grammatical Feature";Pronunciation;"English Translation";Position;Kanji;KanjiID
    return {
      id: parts[0],
      kanji: parts[1],
      romanji: parts[4],
      translation: (parts[5] || "").trim(),
      position: parts[6],
      kanjiId: parts[8],
    };
  });
module.exports = { kanji, words };
