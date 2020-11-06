<script>
  import Question from "../Question.svelte";
  import { config, selectedCourse, alerts } from "../../data";
  import { shuffle, unique } from "../../util";
  let baseurl = "";
  let startList = [];
  let list = [];
  let active = {};
  window
    .fetch(`${baseurl}/language?size=20`)
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
      let jp = Math.random() >= 0.5;
      active = {
        rom: selected.rom,
        display: jp ? selected.jp : shuffle(selected.translations)[0],
        correct: jp ? shuffle(selected.translations)[0] : selected.rom,
        writing: true
      };
      list.shift();
      console.log(list);
    }
  }
</script>

<Question {...active} onNext={() => nextWord()} />
