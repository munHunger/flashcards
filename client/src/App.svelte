<script>
  import Setup from "./Setup.svelte";
  import Card from "./Card.svelte";
  import Alert from "./Alert.svelte";
  import { config } from "./data";
</script>

<style>
  :global(body) {
    background-color: rgb(46, 49, 51);
  }
</style>

{#if !$config}
  <Setup />
{:else}
  <Card />
{/if}

<Alert />
