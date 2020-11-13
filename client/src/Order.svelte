<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";

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

  export let options = [];
  let selectedOptions = [];
  function addOption(option) {
    selectedOptions = selectedOptions.concat(option);
  }
  function removeOption(option) {
    selectedOptions = selectedOptions
      .splice(0, selectedOptions.indexOf(option))
      .concat(
        selectedOptions.splice(
          selectedOptions.indexOf(option) + 1,
          selectedOptions.length
        )
      );
  }

  export function getValue() {
      return selectedOptions.join("");
  }
</script>

<div class="ui row">
  {#each selectedOptions as option (option)}
    <div
      class="ui basic button"
      in:receive={{ key: option }}
      out:send={{ key: option }}
      animate:flip
      on:click={() => removeOption(option)}>
      {option}
    </div>
  {/each}
</div>
<br />
<div class="ui row">
  {#each options.filter(option => selectedOptions.indexOf(option) === -1) as option (option)}
    <div
      class="ui basic button"
      in:receive={{ key: option }}
      out:send={{ key: option }}
      animate:flip
      on:click={() => addOption(option)}>
      {option}
    </div>
  {/each}
</div>
