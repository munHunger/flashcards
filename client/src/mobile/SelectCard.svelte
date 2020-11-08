<script>
  export let selected, display, onClick;
</script>

<style>
  .card {
    position: relative;
    display: inline-block;
    padding: 2rem;
    background-color: #efefef;
    border-radius: 1rem;
    box-shadow: inset 0rem 0rem 0.5rem #fff;
    border-bottom: solid 0.4rem #999;
    box-sizing: border-box;
    margin: 0.5rem;
  }

  .light {
    position: absolute;
    width: 1rem;
    height: 1rem;
    left: 0.5rem;
    top: 0.5rem;
    border-radius: 100%;
    box-shadow: inset 0rem 0rem 0.25rem #fff;
    background-color: #ccc;
    border: 0.05rem solid #fff;
    transition: all ease-in-out 0.2s;
  }

  .light.selected {
    background-color: #0ee681;
    box-shadow: inset 0rem 0rem 0.25rem #5dffb4;
  }
  .character {
    font-size: 1.5rem;
    color: #777;
  }
</style>

<div class="card" on:click={onClick}>
  <div class="light {selected ? 'selected' : ''}" />
  <div class="character">{display}</div>
</div>
