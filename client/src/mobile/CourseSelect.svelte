<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  import { selectedCourse } from "../data";

  let courses = [
    { name: "hiragana", desc: "ひらがな to romanji" },
    { name: "katakana", desc: "カタカナ to romanji" },
    { name: "kanji words", desc: "kanji combinations" }
  ];

  function select(course) {
    selectedCourse.set(course);
  }

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        delay: params.delay || 0,
        easing: quintOut,
        css: t => `
					transform: ${transform} scaleX(${0.5 + t / 2});
					opacity: ${t}
				`
      };
    }
  });
</script>

<style>
  .course {
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.164);
    margin: 1rem;
    border-radius: 2rem;
    letter-spacing: 0.05rem;
    color: #444;
    border-bottom: solid 0.2rem rgba(0, 0, 0, 0.2);
    box-sizing: content-box;
    transition: all ease-in-out 0.2s;
    box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0);
  }

  .course:active {
    box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0.2);
    border-bottom: solid 0rem rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: 0.7rem;
    color: #666;
    font-family: Roboto, sans-serif;
  }
</style>

{#each courses as course, i (course.name)}
  <div
    in:receive={{ key: course.name, delay: i * 20 }}
    class="course"
    on:click={() => select(course)}>
    {course.name}
    <div class="subtitle">{course.desc}</div>
  </div>
{/each}
