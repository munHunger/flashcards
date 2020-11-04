<script>
  export let title, max, current;
  $: progress = (current / max) * 95 + 5;
</script>

<style>
  .progress-bar {
    position: relative;
    background-color: rgba(0, 0, 0, 0.25);
    height: 1rem;
    border-radius: 1rem;
    margin: 0.2rem;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.25);
  }

  .progress-bar .bar {
    position: absolute;
    background: linear-gradient(to right, #ec5f3c, #e6390e);
    box-shadow: 0 0 5px #ec5f3c;
    height: 1rem;
    left: 0px;
    top: 0px;
    border-radius: 1rem;
    transition: all ease 0.1s;
  }
</style>

<div class="title">{title}</div>
<div class="progress-bar">
  <div class="bar" style="width: {progress}%" />
</div>
