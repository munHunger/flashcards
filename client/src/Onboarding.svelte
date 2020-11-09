<script>
  import { cubicInOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";
  import { username as storedUser } from "./data";
  let username = "";

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 1000,
        delay: params.delay || 0,
        easing: cubicInOut,
        css: t => `
					transform: ${transform} translateY(${(1 - t) * 15}px);
					opacity: ${t}
				`
      };
    }
  });

  function submit() {
    storedUser.set(username);
  }
</script>

<style>
  .center.input {
    text-align: center;
  }
</style>

<div class="ui centered grid">
  <h1 class="ui row header" in:receive={{ key: 'hello' }} out:fade>Hello!</h1>
  <h3
    class="ui row header"
    in:receive={{ key: 'subtitle', delay: 500 }}
    out:fade>
    Type your username below to get started
  </h3>
  <div
    class="ui row transparent input"
    in:receive={{ key: 'subtitle', delay: 750 }}
    out:fade>
    <input
      type="text"
      class="center input"
      placeholder="username"
      bind:value={username} />
  </div>
  {#if username.length > 0}
    <button
      in:receive={{ key: 'submit' }}
      out:fade
      class="ui primary button"
      on:click={submit}>
      lets go
    </button>
  {/if}
</div>
