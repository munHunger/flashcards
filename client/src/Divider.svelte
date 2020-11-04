<script>
  export let top = "#f00";
  export let bottom = "#0F0";
</script>

<style>
  .wrapper {
    height: 2rem;
    background-color: red;
  }
  .top {
    background-color: green;
  }
  .top .content {
    background-color: aquamarine;
    height: 1rem;
    border-bottom-right-radius: 2rem;
  }
  .bottom {
    background-color: blue;
  }
  .bottom .content {
    background-color: goldenrod;
    height: 1rem;
    border-top-left-radius: 2rem;
  }
</style>

<div class="wrapper">
  <div class="top" style="background-color: {bottom}">
    <div class="content" style="background-color: {top}" />
  </div>
  <div class="bottom" style="background-color: {top}">
    <div class="content" style="background-color: {bottom}" />
  </div>
</div>

<div style="background-color: {bottom}">
  <slot />
</div>
