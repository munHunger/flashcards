<script>
  import Onboarding from "./Onboarding.svelte";
  import Courses from "./Courses.svelte";
  import Settings from "./Settings.svelte";
  import Course from "./Course.svelte";
  import Message from "./Message.svelte";
  import { username, course, settings } from "./data";
</script>

<style>
  :global(html, body) {
    height: 100%;
    background-color: #fff;
    padding: 2rem;
    margin: 0px;
    font-family: "Poppins", sans-serif;
    display: flex;
    overflow: scroll;
    align-items: center;
    justify-content: center;
  }
</style>

{#if !$username}
  <Onboarding />
{:else if $settings}
  <Settings />
{:else if !$course}
  <Courses />
{:else}
  <Course />
{/if}

<Message />
