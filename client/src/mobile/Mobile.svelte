<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import ProgressBar from "./ProgressBar.svelte";
  import Question from "./Question.svelte";
  import Divider from "../Divider.svelte";
  import Card from "./Card.svelte";
  import CourseSelect from "./CourseSelect.svelte";
  import Hiragana from "./courses/Hiragana.svelte";
  import Katakana from "./courses/Katakana.svelte";
  import { config, selectedCourse, alerts } from "../data";
  import { shuffle, unique } from "../util";
  let baseurl = "";
  let list = [];
  let active = {};
  let startLength = 0;
  window
    .fetch(`${baseurl}/kanji/word?jlpt=5`)
    .then(res => res.json())
    .then(res => {
      list = shuffle(res);
      startLength = list.length;
      nextWord();
    });

  function nextWord() {
    let selected = list[0];
    console.log(selected);
    let leftBased = selected.position === "L";

    console.log(selected);
    active = {
      rom: selected.romanji,
      display: leftBased
        ? selected.kanji.substring(1)
        : selected.kanji.substring(0, 1),
      correct: leftBased
        ? selected.kanji.substring(0, 1)
        : selected.kanji.substring(1),
      leftBased: leftBased,
      options: shuffle(
        unique(
          list
            .filter(item => item.kanjiId === selected.kanjiId)
            .map(item =>
              leftBased ? item.kanji.substring(0, 1) : item.kanji.substring(1)
            )
        ).slice(0, 5)
      ),
      translation: shuffle(selected.translation)[0]
    };
    if (active.options.indexOf(active.correct) === -1) {
      active.options = shuffle(
        [active.correct].concat(active.options).slice(0, 5)
      );
    }
    list.shift();
  }

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      const direction = params.out ? -1 : 1;
      return {
        duration: 600,
        delay: params.delay || 0,
        easing: quintOut,
        css: t => `
          transform: ${transform} translateX(${(1 - t) * 100 * direction}%);
          opacity: ${t}
				`
      };
    }
  });
</script>

<style>
  .wrapper {
    position: absolute;
    left: 0px;
    top: 0px;
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
  }

  .header {
    background-color: rgb(54, 31, 55);
    flex: 1 1 auto;
  }

  .bottom {
    background-color: rgb(67, 49, 68);
    min-height: 50px;
    flex: 1 1;
  }
  .progress {
    color: rgba(255, 255, 255, 1);
    font-size: 0.7rem;
    background-color: rgb(98, 81, 99);
    border-radius: 2rem;
    margin: 1rem;
    padding: 2rem;
  }
</style>

{#if !$selectedCourse}
  <div class="wrapper" out:send={{ key: 'courseSelect', out: true }}>
    <div class="header" />
    <Divider top="rgb(54, 31, 55)" bottom="#eee">
      <CourseSelect />
    </Divider>
  </div>
{:else}
  <div class="wrapper" in:receive={{ key: 'course', out: false }}>
    <div class="header" />
    <Divider top="rgb(54, 31, 55)" bottom="rgb(61, 38, 63)">
      <Card>
        {#if $selectedCourse.name === 'hiragana'}
          <Hiragana />
        {:else if $selectedCourse.name === 'katakana'}
          <Katakana />
        {:else}
          <Question {...active} onNext={() => nextWord()} />
        {/if}
      </Card>
    </Divider>
    <Divider top="rgb(61, 38, 63)" bottom="rgb(67, 49, 68)" />
    <div class="bottom">
      <div class="progress">
        <ProgressBar
          title="JLTP 3,4,5"
          max={startLength}
          current={startLength - list.length} />
      </div>
    </div>
  </div>
{/if}
