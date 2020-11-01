const express = require("express");
const { monitoring } = require("otto-lib");
let { cards } = require("./cards");

let { kanji } = require("./kanji");

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

  app.get("/kanji/word", (req, res) => {
    let jlpt = req.query.jlpt.split(",");
    res.send(
      JSON.stringify(kanji.filter((kanji) => jlpt.indexOf(kanji.jlpt) > -1))
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
