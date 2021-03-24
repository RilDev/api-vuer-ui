<template>
  <li
    :title="containerTitle"
    :class="classesContainer"
    class="mb-2 px-5 py-2 rounded-md shadow-md flex justify-between relative transition"
    @click="$emit('loadHistoryLog', log)"
  >
    <span :class="classesSearch">{{ log.search }}</span>
    <span class="text-gray-500 pr-7">{{ log.date }}</span>
    <div
      title="Delete Log"
      class="absolute top-2 right-4 cursor-pointer"
      @click.stop="$emit('deleteHistoryLog', index)"
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
        />
      </svg>
    </div>
  </li>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    log: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  emits: ["loadHistoryLog", "deleteHistoryLog"],
  setup(props) {
    const containerTitle = computed(() => {
      return props.log.results.length > 0 ? "Load Log" : "";
    });

    const classesContainer = computed(() => {
      return {
        "bg-gray-50": props.log.results.length > 0,
        "hover:bg-gray-100": props.log.results.length > 0,
        "bg-gray-200": props.log.results.length === 0,
        "cursor-pointer": props.log.results.length > 0,
      };
    });

    const classesSearch = computed(() => {
      return {
        "line-through": props.log.results.length === 0,
      };
    });

    return { containerTitle, classesContainer, classesSearch };
  },
};
</script>
