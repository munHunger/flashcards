const express = require("express");
const { monitoring } = require("otto-lib");
let { cards } = require("./cards");

let { kanji, words } = require("./kanji");
let { hiragana } = require("./hiragana");
let { katakana, katakanaWords } = require("./katakana");
let courses = require("./courses");
let serverPort = 5001;
let monitoringPort = 4000;
process.argv.forEach((line) => {
  if (line.split("=")[0] === "monitoring") monitoringPort = line.split("=")[1];
  if (line.split("=")[0] === "server") serverPort = line.split("=")[1];
});

monitoring.server(monitoringPort).then((monitoring) => {
  const app = express();
  app.use(express.json());

  app.use("", express.static("node_modules/flash-client/public"));

  courses.init(app);

  app.get("/kanji", (req, res) => {
    let jlpt = req.query.jlpt.split(",");
    res.send(
      JSON.stringify(kanji.filter((kanji) => jlpt.indexOf(kanji.jlpt) > -1))
    );
  });

  app.get("/hiragana", (req, res) => {
    res.send(JSON.stringify(hiragana));
  });
  app.get("/katakana", (req, res) => {
    res.send(JSON.stringify(katakana));
  });
  app.get("/katakana/words", (req, res) => {
    res.send(JSON.stringify(katakanaWords));
  });

  app.get("/kanji/word", (req, res) => {
    let jlpt = req.query.jlpt.split(",");
    res.send(
      JSON.stringify(
        kanji
          .filter((kanji) => jlpt.indexOf(kanji.jlpt) > -1)
          .map((k) =>
            words
              .filter((word) => word.kanjiId === k.id)
              .map((word) => ({
                ...word,
                other:
                  word.position === "L"
                    ? word.kanji.substring(1)
                    : word.kanji.substring(0, 1),
              }))
              .map((word) => ({
                ...word,
                other: kanji.find((k) => k.kanji === word.other),
              }))
              .filter(
                (word) => word.other && jlpt.indexOf(word.other.jlpt) > -1
              )
          )
          .reduce((acc, val) => acc.concat(val), [])
      )
    );
  });

  app.get("/card", (req, res) => {
    res.send(JSON.stringify(cards[Math.floor(Math.random() * cards.length)]));
  });

  app.post("/card/:rom", (req, res) => {
    let card = cards.find((card) => card.rom === req.params.rom);
    let input = req.body;
    console.log(card);
    console.log(input);
    if (card.en === input.en) res.send("OK");
    else res.send("NO");
  });

  app.listen(serverPort, () => {
    console.log(`Example app listening at http://localhost:${serverPort}`);
    monitoring.setUp();
  });
});
