<template>
  <div
    class="hidden sm:mt-6 sm:flex sm:flex-col sm:flex-grow sm:overflow-hidden"
  >
    <div class="text-3xl text-center font-bold">Recent History</div>
    <ul v-if="searchHistory.length" class="mt-4 h-full overflow-auto">
      <slot></slot>
    </ul>
    <div v-else class="text-center text-gray-500 mt-4">No logs yet...</div>
  </div>
</template>

<script>
export default {
  props: {
    searchHistory: {
      type: Object,
      required: true,
    },
  },
};
</script>
