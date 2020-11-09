<script>
  import { course, sendAlert } from "./data";
  import server from "./server";
  let currentIndex = 0;

  let isWritingPrompt = true;
  let input = "";
  let jpToRom = Math.random() > 0.5;

  let showAnswer = false;

  function submitPressed() {
    if (showAnswer) next();
    else submit();
  }
  function submit() {
    showAnswer = true;
    let correct = false;
    if (jpToRom) {
      correct =
        $course.questions[currentIndex].translations
          .map(t => t.toLowerCase())
          .indexOf(input.toLowerCase().trim()) > -1;
    } else {
      correct =
        $course.questions[currentIndex].rom.toLowerCase() ===
        input.toLowerCase().trim();
    }
    $course.questions[currentIndex].success = correct;

    sendAlert(correct ? "correct" : "wrong", correct ? "positive" : "negative");
  }

  function next() {
    showAnswer = false;
    input = "";
    jpToRom = Math.random() > 0.5;
    currentIndex++;
    if (currentIndex >= $course.questions.length) {
      console.log("well done");
      server.saveCourse($course);
      course.set(null);
    }
  }
</script>

<style>
  .actions {
    position: absolute;
    bottom: 1rem;
  }
  .center.input {
    text-align: center;
  }
  .progress {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 0.7rem;
    color: #666;
  }
</style>

{#if $course}
  <div class="progress">{currentIndex}/{$course.questions.length}</div>
  <div class="ui centered grid">

    {#if showAnswer}
      <div class="ui row">
        <h3 class="ui header">{$course.questions[currentIndex].jp}</h3>
      </div>
      <div class="ui row">
        {$course.questions[currentIndex].translations.join(', ')}
      </div>
      <div class="ui row">{$course.questions[currentIndex].rom}</div>
    {:else}
      <div class="ui row">
        <h2 class="ui header">
          {#if jpToRom}
            {$course.questions[currentIndex].jp}
          {:else}{$course.questions[currentIndex].translations.join(', ')}{/if}
        </h2>
      </div>
      <div class="ui row transparent input">
        <input
          type="text"
          class="center input"
          placeholder="answer"
          bind:value={input} />
      </div>
    {/if}
  </div>

  <div class="actions">
    <div class="ui two bottom attached buttons">
      <div class="ui button">skip</div>
      {#if isWritingPrompt}
        <div class="ui button" on:click={submitPressed}>
          {showAnswer ? 'next' : 'submit'}
        </div>
      {/if}
    </div>
  </div>
{/if}
