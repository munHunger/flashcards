<script>
  export let display, options, leftBased, translation, correct, rom, onNext;

  let showAnswer = false;
  let wasCorrect = undefined;
  function selected(option) {
    showAnswer = true;
    wasCorrect = option === correct;
    if (onNext)
      setTimeout(() => {
        showAnswer = false;
        wasCorrect = undefined;
        onNext(wasCorrect);
      }, 1000);
  }
</script>

<style>
  .question {
    color: rgb(66, 39, 54);
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .question .underscore {
    letter-spacing: 2rem;
    border-bottom: solid 0.2rem #e6390e;
  }

  .question .underscore.correct {
    color: #0ee681;
    letter-spacing: 0rem;
    border-bottom: none;
  }
  .question .underscore.wrong {
    letter-spacing: 0rem;
    border-bottom: none;
  }

  button {
    font-size: 2rem;
    margin: 0.25rem;
    background-color: #fff;
    color: #ec5f3c;
    border: solid 0.1rem #ec5f3c;
    border-radius: 0.5rem;
    box-shadow: 0 0.2rem 0px #e6390e;
    transition: all ease-in-out 0.15s;
    outline: none;
    user-select: none;
  }
  button:active {
    box-shadow: 0 0rem 0px #e6390e;
    transform: translateY(0.2rem);
  }

  .translation {
    letter-spacing: 0.1rem;
    color: #555;
    font-size: 0.7rem;
  }
</style>

{#if translation}
  <div class="translation">{translation}</div>
{/if}

<div class="question">
  {#if leftBased}
    <span
      class="underscore {wasCorrect ? 'correct' : wasCorrect == undefined ? '' : 'wrong'}">
      {#if showAnswer}{correct}{:else}&nbsp;{/if}
    </span>
  {/if}
  {display}
  {#if !leftBased}
    <span
      class="underscore {wasCorrect ? 'correct' : wasCorrect == undefined ? '' : 'wrong'}">
      {#if showAnswer}{correct}{:else}&nbsp;{/if}
    </span>
  {/if}
</div>

{#if !showAnswer}
  {#each options || [] as option}
    <button on:click={() => selected(option)}>{option}</button>
  {/each}
{:else}{rom}{/if}
