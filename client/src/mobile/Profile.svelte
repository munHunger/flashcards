<script>
  import { profile, kanji } from "../data";
  import SelectCard from "./SelectCard.svelte";
  let profiles = new Array(15)
    .fill(0)
    .map((_, i) => `/avatars/64_${i + 1}.png`);

  function selectProfile(index) {
    profile.update(p => {
      console.log(p);
      p.avatar = index + 1;
      return p;
    });
  }
  function isMyAvatar(i) {
    console.log(`checking ${i} === ${$profile.avatar}`);
    return i + 1 === $profile.avatar;
  }
</script>

<style>
  img {
    display: inline-block;
    margin: 0.2rem;
  }

  img.selectedAvatar {
    border-radius: 100%;
    margin: 0rem;
    border: solid 0.2rem #ec5f3c;
  }
</style>

{#each profiles as profile, i}
  <img
    src={profile}
    class={isMyAvatar(i) ? 'selectedAvatar' : ''}
    alt={profile}
    on:click={() => selectProfile(i)} />
{/each}
<div style="clear:both" />
<div class="form__group field">
  <input
    type="input"
    class="form__field"
    placeholder="Name"
    name="name"
    id="name"
    bind:value={$profile.username}
    required />
  <label for="name" class="form__label">Name</label>
</div>

{#each Object.keys($kanji) as key}
  <SelectCard
    display={key}
    selected={$kanji[key].known}
    onClick={() => kanji.update(k => {
        k[key].known = !k[key].known;
        return k;
      })} />
{/each}
