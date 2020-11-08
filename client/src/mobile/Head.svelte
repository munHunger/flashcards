<script>
  import { page, profile } from "../data";
  function navToProfile() {
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
  .username {
    margin-top: 1rem;
    color: #ec5f3c;
  }
</style>

<div class="header">
  <div class="right">
    <div class="username">{($profile || {}).username}</div>
    <div class="avatar" on:click={navToProfile}>
      <img src="/avatars/64_{($profile || {}).avatar || 1}.png" alt="avatar" />
    </div>
  </div>
</div>
