<template>
  <div>
    <slot></slot>
    <div>{{ robotSays }}</div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    hasSearch: {
      type: Boolean,
      required: true,
    },
    hasResults: {
      type: Boolean,
      required: true,
    },
    isSearching: {
      type: Boolean,
      required: true,
    },
    isHistoryLog: {
      type: Boolean,
      required: true,
    },
    isSearchDelay: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const robotSays = computed(() => {
      // load history log
      if (props.isHistoryLog && props.hasResults) {
        return "Data retrieved from memory!";
      }
      // load history log with no resutls search
      if (props.isHistoryLog && !props.hasResults) {
        return "That one was a bad one!";
      }
      // no search yet
      if (!props.hasSearch) {
        return "Awaiting search request!";
      }
      // user is typing
      if (props.hasSearch && props.isSearchDelay) {
        return "Listening...";
      }
      // is searching
      if (props.hasSearch && props.isSearching) {
        return "Searching...";
      }
      // no search results
      if (props.hasSearch && !props.hasResults && !props.isSearchDelay) {
        return "No results found!";
      }
      // has search results
      if (props.hasSearch && props.hasResults) {
        return "Here you go!";
      }
    });

    return { robotSays };
  },
};
</script>
