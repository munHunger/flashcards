<script>
  import { config, alerts } from "./data";
  let baseurl = "http://localhost:5002";
  if ($config.type === "kanji in words") {
    window
      .fetch(
        `${baseurl}/kanji/word?jlpt=${Object.keys($config.JLPT).join(",")}`
      )
      .then(res => res.json())
      .then(list => {
        cards = {
          list: list.map(card => ({
            ...card,
            validate: input => card.translation.indexOf(input) > -1
          })),
          nextCard: () => {
            let low = cards.list
              .map(card => card.viewCount || 0)
              .reduce((acc, val) => Math.min(acc, val), 9999);
            if (low > 0) {
              alerts.update(alerts =>
                alerts.concat(
                  `Well done! you answered ${correct} out of ${cards.list.length} correct`
                )
              );
              correct = 0;
              errors = 0;
            }
            console.log(low);
            let card = shuffle(
              cards.list.filter(card => (card.viewCount || 0) === low)
            )[0];
            card.display = card.kanji;
            card.correct = card.translation;
            card.viewCount = (card.viewCount || 0) + 1;
            console.log(card);
            return card;
          }
        };
        card = cards.nextCard();
      });
  } else {
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
  }
  let correct = 0;
  let errors = 0;
  let lastCorrect = "";
  let cards = { list: [] };
  let errorStack = [];

  let card = undefined;
  let currentInput = "";

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

  function handleKeydown(e) {
    if (e.key === "Backspace")
      currentInput = currentInput.substring(0, currentInput.length - 1);
    if (e.key === "Enter") {
      next(card.validate(currentInput));
    }
    if (e.key.length > 1) return;
    currentInput += e.key;
  }
  function next(wasCorrect) {
    currentInput = "";
    if (wasCorrect) {
      lastCorrect = "";
      correct++;
      card = cards.nextCard();
    } else {
      errorStack.push(card);
      lastCorrect = card.correct;
      errors++;
      card = cards.nextCard();
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

  .total {
    position: absolute;
    bottom: 5%;
    left: 5%;
    font-size: 3rem;
    color: #287588;
  }

  .exit {
    cursor: pointer;
    position: absolute;
    top: 5%;
    left: 5%;
    font-size: 2rem;
    color: #287588;
  }
</style>

<svelte:window on:keydown={handleKeydown} />
{#if card}
  <div class="card">{card.display}</div>
{/if}
<div class="correct">{correct}</div>
<div class="errors">{errors}</div>

<div class="input">{currentInput}</div>

<div class="last">{lastCorrect}</div>

<div class="total">{cards.list.length}</div>

<div class="exit" on:click={() => config.set(undefined)}>exit</div>
