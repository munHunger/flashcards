<style>
  .card,
  .body {
    border-radius: 2rem;
  }

  .card {
    flex: 1 1;
    background-color: #ddd;
    margin: 1rem;
  }

  .body {
    padding: 2rem;
    text-align: center;
    min-height: 200px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .card .buttons {
    margin-left: 2rem;
    box-sizing: border-box;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    color: #fff;
  }
  .buttons i {
    cursor: pointer;
  }
</style>

<div class="card">
  <div class="body">
    <slot />
  </div>
  <div class="buttons">
    <i class="far fa-bookmark" />
  </div>
</div>
