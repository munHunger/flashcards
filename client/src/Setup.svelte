<script>
  import { config } from "./data";
  let page = 0;
  let setup = {
    type: {
      question: "What type of training are we doing",
      options: ["kanji in words", "hiragana"],
      onSelect: option => {
        setup.type.selected = option;
        page++;
      }
    },
    JLPT: {
      question: "select JLPT levels",
      options: [3, 4, 5],
      selected: {},
      onSelect: option => {
        setup.JLPT.selected[option] = !setup.JLPT.selected[option];
        selected = setup.JLPT.selected;
        console.log(setup.JLPT.selected);
      }
    }
  };
  $: question = getQuestion(page);
  $: hasNext = Object.keys(setup).length !== page + 1;

  function start() {
    config.set(
      Object.keys(setup).reduce((acc, val) => {
        acc[val] = setup[val].selected;
        return acc;
      }, {})
    );
  }

  let selected = getQuestion(page).selected || {};

  function getQuestion(page) {
    return setup[Object.keys(setup)[page || 0]];
  }

  function isSelected(question, option) {
    console.log("isSelected");
    return (question.selected || []).indexOf(option) > -1;
  }

  function onClick(option) {
    getQuestion(page).onSelect(option);
  }
</script>

<style>
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .question {
    color: #287588;
    margin: 20px;
    font-size: 2rem;
  }
  button {
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    color: #287588;
    border: 3px solid #287588;
    border-radius: 10px;
    padding: 10px;
    transition: all ease-in-out 0.2s;
    margin: 10px;
  }
  button:hover {
    color: #284a88;
    border: 3px solid #284a88;
  }

  button.selected {
    border: 3px solid #7a134c;
    color: #7a134c;
  }
</style>

<div class="wrapper">

  <div class="question">{question.question}</div>
  <div class="input">
    {#each question.options as option}
      <button
        on:click={() => onClick(option)}
        class={selected[option] ? 'selected' : ''}>
        {option}
      </button>
    {/each}
  </div>

  {#if !hasNext}
    <button on:click={start}>start</button>
  {/if}
</div>
