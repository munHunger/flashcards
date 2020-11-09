<script>
  import Onboarding from "./Onboarding.svelte";
  import Courses from "./Courses.svelte";
  import Course from "./Course.svelte";
  import Message from "./Message.svelte";
  import { username, course } from "./data";
</script>

<style>
  :global(html, body) {
    height: 100%;
    background-color: #fff;
    padding: 0px;
    margin: 0px;
    font-family: "Poppins", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

{#if !$username}
  <Onboarding />
{:else if !$course}
  <Courses />
{:else}
  <Course />
{/if}

<Message />
