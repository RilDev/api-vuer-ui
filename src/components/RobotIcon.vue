<template>
  <svg width="150" height="150" viewBox="0 0 24 24" class="fill-current">
    <path :d="this.robotState" />
  </svg>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    hasSearch: { type: Boolean, required: true },
    isSearching: { type: Boolean, required: true },
    hasResults: { type: Boolean, required: true },
    isSearchDelay: { type: Boolean, required: true },
    isHistoryLog: { type: Boolean, required: true },
  },
  setup(props) {
    // static values
    const robotNoSearch =
      "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z";
    const robotSearching =
      "M22 14H21C21 10.13 17.87 7 14 7H13V5.73C13.6 5.39 14 4.74 14 4C14 2.9 13.11 2 12 2S10 2.9 10 4C10 4.74 10.4 5.39 11 5.73V7H10C6.13 7 3 10.13 3 14H2C1.45 14 1 14.45 1 15V18C1 18.55 1.45 19 2 19H3V20C3 21.11 3.9 22 5 22H19C20.11 22 21 21.11 21 20V19H22C22.55 19 23 18.55 23 18V15C23 14.45 22.55 14 22 14M21 17H19V20H5V17H3V16H5V14C5 11.24 7.24 9 10 9H14C16.76 9 19 11.24 19 14V16H21V17M8.5 13.5L10.86 15.86L9.68 17.04L8.5 15.86L7.32 17.04L6.14 15.86L8.5 13.5M15.5 13.5L17.86 15.86L16.68 17.04L15.5 15.86L14.32 17.04L13.14 15.86L15.5 13.5Z";
    const robotNoResult =
      "M10.62 14.44L9.56 15.5L10.62 16.56L9.56 17.62L8.5 16.56L7.44 17.62L6.38 16.56L7.44 15.5L6.38 14.44L7.44 13.38L8.5 14.44L9.56 13.38L10.62 14.44M16.56 13.38L15.5 14.44L14.44 13.38L13.38 14.44L14.44 15.5L13.38 16.56L14.44 17.62L15.5 16.56L16.56 17.62L17.62 16.56L16.56 15.5L17.62 14.44L16.56 13.38M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z";
    const robotHasResults =
      "M10.5 15.5C10.5 15.87 10.4 16.2 10.22 16.5C9.88 15.91 9.24 15.5 8.5 15.5S7.12 15.91 6.78 16.5C6.61 16.2 6.5 15.87 6.5 15.5C6.5 14.4 7.4 13.5 8.5 13.5S10.5 14.4 10.5 15.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16M15.5 13.5C14.4 13.5 13.5 14.4 13.5 15.5C13.5 15.87 13.61 16.2 13.78 16.5C14.12 15.91 14.76 15.5 15.5 15.5S16.88 15.91 17.22 16.5C17.4 16.2 17.5 15.87 17.5 15.5C17.5 14.4 16.61 13.5 15.5 13.5Z";

    // computed
    const robotState = computed(() => {
      // successful log retreival
      if (props.isHistoryLog && props.hasResults) {
        return robotHasResults;
      }
      // unsuccessful log retreival
      if (props.isHistoryLog && !props.hasResults) {
        return robotNoResult;
      }
      // no search yet
      if (!props.hasSearch || props.isSearchDelay) {
        return robotNoSearch;
      }
      // is searching
      if (props.isSearching) {
        return robotSearching;
      }
      // no search results
      if (!props.hasResults) {
        return robotNoResult;
      }
      // has search results
      if (props.hasResults) {
        return robotHasResults;
      }
    });

    return {
      // static values
      robotNoSearch,
      robotSearching,
      robotNoResult,
      robotHasResults,
      // computed
      robotState,
    };
  },
};
</script>
