<script>
  import { courses } from "./data";
  import server from "./server";

  function practice(course) {
    server.getCourseTest(course);
  }
</script>

<div class="ui cards">
  {#each $courses || [] as course}
    <div class="card">
      <div class="content">
        <div class="header">{course.name}</div>
        {#if course.knowledge}
          <div class="meta">{course.knowledge}</div>
        {/if}
        <div class="description">{course.description}</div>
      </div>
      <div class="extra content">
        <div class="ui two buttons">
          <div class="ui basic green button" on:click={() => practice(course)}>
            Practice
          </div>
          <div class="ui basic orange button">Exam</div>
        </div>
      </div>
    </div>
  {/each}
</div>
