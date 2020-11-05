<script>
  import Question from "../Question.svelte";
  import { config, selectedCourse, alerts } from "../../data";
  import { shuffle, unique } from "../../util";
  let baseurl = "";
  let startList = [];
  let list = [];
  let active = {};
  window
    .fetch(`${baseurl}/katakana`)
    .then(res => res.json())
    .then(res => {
      list = shuffle(res);
      startList = list.slice(0);
      nextWord();
    });

  function nextWord() {
    let selected = list[0];

    if (!selected) {
      alerts.update(alerts => alerts.concat("Well done"));
      return;
    } else {
      console.log(selected);

      active = {
        rom: selected.rom,
        display: selected.jp,
        correct: selected.rom,
        options: shuffle(startList.map(list => list.rom)).slice(0, 5)
      };
      if (active.options.indexOf(active.correct) === -1) {
        active.options = shuffle(
          [active.correct].concat(active.options).slice(0, 5)
        );
      }
      list.shift();
    }
  }
</script>

<Question {...active} onNext={() => nextWord()} />
