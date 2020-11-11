<script>
  import { settings } from "./data";

  function save() {
    settings.set(undefined);
  }
  function setAll(e) {
    settings.update(course => {
      course.words = course.words.map(word => ({
        ...word,
        enabled: e.target.checked
      }));
      return course;
    });
  }
</script>

<style>
  .subtitle {
    font-size: 0.7rem;
    color: #666;
  }
  .toggle {
    float: right;
  }
  .list {
    width: 100%;
    margin: auto;
  }
</style>

<div class="ui relaxed divided list">
  <div class="item">
    <div class="content">
      enable all
      <div class="ui toggle checkbox">
        <input
          type="checkbox"
          name="public"
          checked={$settings.words.every(word => word.enabled)}
          on:change={setAll} />
        <label />
      </div>
    </div>
  </div>
  {#each $settings.words as word}
    <div class="item">
      <div class="content">
        <div class="header">{word.jp}</div>
        <div class="subtitle">{word.rom}</div>
        {word.translations.join(', ')}
        <div class="ui toggle checkbox">
          <input type="checkbox" name="public" bind:checked={word.enabled} />
          <label />
        </div>
      </div>
    </div>
  {/each}
  <button class="ui primary button" on:click={save}>Save</button>
</div>
