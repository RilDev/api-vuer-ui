<template>
  <footer class="flex items-center justify-center h-16">
    <span>
      <a
        href="https://rildev.website"
        target="_blank"
        rel="noopener"
        class="text-blue-600 hover:text-blue-500 transition"
      >
        RilDev</a
      >
      &copy; {{ computedYearNow }}
    </span>
  </footer>
</template>

<script>
import { computed } from "vue";
import useTime from "/src/use/time";

export default {
  setup() {
    const { yearNow } = useTime();

    const computedYearNow = computed(() => {
      return yearNow();
    });

    return { computedYearNow };
  },
};
</script>
