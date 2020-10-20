<script>
  window
    .fetch("/lists.json")
    .then(res => res.json())
    .then(lists => {
      window
        .fetch(lists[0].path)
        .then(res => res.text())
        .then(list => {
          list.split("\n").forEach(row => {
            let parts = row.split(";");
            cards.push({
              jp: parts[0],
              rom: parts[1],
              en: parts[2]
            });
          });
          console.log(cards);
          card = getRandomCard();
        });
    });
  let correct = 0;
  let errors = 0;
  let lastCorrect = "";
  let cards = [
    {
      jp: "ねこ",
      rom: "neko",
      en: "cat"
    },
    {
      jp: "あの",
      rom: "ano",
      en: "um"
    },
    {
      jp: "いま",
      rom: "ima",
      en: "now"
    },
    {
      jp: "えいご",
      rom: "eego",
      en: "english"
    },
    {
      jp: "ええ",
      rom: "ee",
      en: "yes"
    },
    {
      jp: "がくせい",
      rom: "gakusei",
      en: "student"
    },
    {
      jp: "~ご",
      rom: "go",
      en: "language"
    },
    {
      jp: "こうこう",
      rom: "koukou",
      en: "high school"
    },
    {
      jp: "ごご",
      rom: "gogo",
      en: "pm"
    },
    {
      jp: "ごぜん",
      rom: "gozen",
      en: "am"
    },
    {
      jp: "~さい",
      rom: "sai",
      en: "years old"
    },
    {
      jp: "~さん",
      rom: "san",
      en: "mr/ms"
    },
    {
      jp: "~じ",
      rom: "ji",
      en: "oclock"
    },
    {
      jp: "~じん",
      rom: "jin",
      en: "people"
    },
    {
      jp: "せんこう",
      rom: "senkou",
      en: "major"
    },
    {
      jp: "せんせい",
      rom: "sensei",
      en: "teacher"
    },
    {
      jp: "そうです",
      rom: "sou desu",
      en: "thats right"
    },
    {
      jp: "そうですか",
      rom: "sou desu ka",
      en: "is that so"
    },
    {
      jp: "だいがく",
      rom: "daigaku",
      en: "university"
    },
    {
      jp: "でんわ",
      rom: "denwa",
      en: "telephone"
    },
    {
      jp: "ともだち",
      rom: "tomodachi",
      en: "friend"
    },
    {
      jp: "なまえ",
      rom: "namae",
      en: "name"
    },
    {
      jp: "なに",
      rom: "nani",
      en: "what"
    },
    {
      jp: "にほん",
      rom: "nihon",
      en: "japan"
    },
    {
      jp: "~ねんせい",
      rom: "nensei",
      en: "year student"
    },
    {
      jp: "はい",
      rom: "hai",
      en: "yes"
    },
    {
      jp: "はん",
      rom: "han",
      en: "half"
    },
    {
      jp: "ばんごう",
      rom: "bangou",
      en: "number"
    },
    {
      jp: "りゅうがくせい",
      rom: "ryuugakusei",
      en: "international student"
    },
    {
      jp: "わたし",
      rom: "watashi",
      en: "i"
    }
  ];
  cards = [];
  let errorStack = [];

  let card = undefined;
  let currentInput = "";

  function getRandomCard() {
    console.log(errorStack);
    console.log(
      Math.random() < 0.3 * errorStack.length || errorStack.length === 0
    );
    let currentRom = (card || {}).rom;
    let newCard = undefined;
    while (!newCard || newCard.rom === currentRom)
      newCard =
        Math.random() < 0.5 || errorStack.length === 0
          ? {
              ...cards[Math.floor(Math.random() * cards.length)],
              jpToRom: Math.random() >= 0.5
            }
          : {
              ...errorStack[Math.floor(Math.random() * errorStack.length)],
              repeat: true
            };
    return newCard;
  }

  function handleKeydown(e) {
    if (e.key === "Backspace")
      currentInput = currentInput.substring(0, currentInput.length - 1);
    if (e.key === "Enter") next(false);
    if (e.key.length > 1) return;
    currentInput += e.key;
    let ans = card.jpToRom ? card.en : card.rom;
    console.log(currentInput + "\t" + ans);

    if (currentInput === ans) {
      next(true);
    } else if (currentInput.length >= ans.length) {
      next(false);
    }
  }
  function next(wasCorrect) {
    currentInput = "";
    if (wasCorrect) {
      if (card.repeat) errorStack = errorStack.filter(e => e.rom != card.rom);
      lastCorrect = "";
      correct++;
      card = getRandomCard();
    } else {
      errorStack.push(card);
      lastCorrect = card.jpToRom ? card.en : card.rom;
      errors++;
    }
  }
</script>

<style>
  :global(body) {
    background-color: rgb(46, 49, 51);
  }
  .card {
    font-size: 15rem;
    color: #287588;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
  }
  .correct {
    position: absolute;
    top: 10%;
    right: 10%;
    font-size: 5rem;
    color: #28887b;
  }
  .errors {
    position: absolute;
    top: 10%;
    left: 10%;
    font-size: 5rem;
    color: #7a134c;
  }

  .last {
    position: absolute;
    top: 10%;
    left: 0%;
    width: 100%;
    text-align: center;
    font-size: 5rem;
    color: #7a134c;
  }

  .input {
    position: absolute;
    bottom: 10%;
    left: 0%;
    width: 100%;
    text-align: center;
    font-size: 5rem;
    color: #287588;
  }
</style>

<svelte:window on:keydown={handleKeydown} />
{#if card}
  <div class="card">{card.jpToRom ? card.jp : card.en}</div>
{/if}
<div class="correct">{correct}</div>
<div class="errors">{errors}</div>

<div class="input">{currentInput}</div>

<div class="last">{lastCorrect}</div>
