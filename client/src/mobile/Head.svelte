<script>
  import { page } from "../data";
  function profile() {
    page.set({ page: "profile" });
  }
</script>

<style>
  .header {
    background-color: rgb(54, 31, 55);
    flex: 0 1 auto;
  }
  .avatar img {
    display: block;
  }

  .avatar {
    display: inline-flex;
    flex: 0 0 auto;
    padding: 0.3rem;
    margin: 0.5rem;
    border: solid 0.2rem #ec5f3c;
    border-radius: 100%;
  }

  .right {
    display: flex;
    justify-content: flex-end;
  }
</style>

<div class="header">
  <div class="right">

    <div class="avatar" on:click={profile}>
      <img
        src="/avatars/64_{Math.floor(Math.random() * 16)}.png"
        alt="avatar" />
    </div>
  </div>
</div>
