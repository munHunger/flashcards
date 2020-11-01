<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { alerts } from "./data";
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });
</script>

<style>
  .wrapper {
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
  .alert {
    background-color: rgb(0, 204, 255);
    font-size: 1.3rem;
    padding: 10px;
    border-radius: 0.25rem;
    color: #333;
    margin-top: 1rem;
  }
</style>

<div class="wrapper">
  {#each $alerts as alert (alert)}
    <div
      class="alert"
      in:receive={{ key: alert }}
      out:send={{ key: alert }}
      animate:flip>
      {alert}
    </div>
  {/each}
</div>
