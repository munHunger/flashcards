<script>
  import { course, sendAlert } from "./data";
  import server from "./server";
  let currentIndex = 0;

  let currentTime, paused;

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
    playAudio();
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
    } else {
      let question = $course.questions[currentIndex];
      let words = question.words;
      words.forEach(word => {
        if (!word.progress) {
          sendAlert(
            "This is a new word for " + jpToRom
              ? question.translations[0]
              : question.jp,
            "info"
          );
        } else if (
          word.progress.hiragana.attempts > 1 &&
          word.progress.hiragana.pass / word.progress.hiragana.attempts < 0.25
        ) {
          sendAlert("This is a hard one", "warning");
        }
      });
    }
  }

  function playAudio() {
    currentTime = 0;
    paused = false;
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

    <audio
      bind:currentTime
      bind:paused
      src="/voice/{$course.questions[currentIndex].rom}.mp3">
      <track kind="captions" />
    </audio>

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
