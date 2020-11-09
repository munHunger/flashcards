<script>
  import { cubicInOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";
  import { alerts } from "./data";

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 700,
        delay: params.delay || 0,
        easing: cubicInOut,
        css: t => `
					transform: ${transform} translateY(${(1 - t) * -30}px);
					opacity: ${t}
				`
      };
    }
  });
</script>

<style>
  .top {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<div class="top">
  {#each $alerts as alert}
    <div
      class="ui {alert.type} message"
      in:receive={{ key: alert.message }}
      out:fade={{ duration: 150 }}>
      <div class="header">{alert.message}</div>
    </div>
  {/each}
</div>
