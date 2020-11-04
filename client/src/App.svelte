<script>
  import Setup from "./Setup.svelte";
  import Card from "./Card.svelte";
  import Alert from "./Alert.svelte";
  import Divider from "./Divider.svelte";
  import MediaQuery from "./MediaQuery.svelte";
  import Mobile from "./mobile/Mobile.svelte";
  import { config } from "./data";
</script>

<style>
  :global(html, body) {
    height: 100%;
    background-color: rgb(61, 38, 63);
    padding: 0px;
    margin: 0px;
    font-family: "Poppins", sans-serif;
  }
</style>

<MediaQuery query="(min-width: 481px)" let:matches>
  {#if matches}
    {#if !$config}
      <Setup />
    {:else}
      <Card />
    {/if}
  {/if}
</MediaQuery>
<MediaQuery query="(max-width: 480px)" let:matches>
  {#if matches}
    <Mobile />
  {/if}
</MediaQuery>
<Alert />
