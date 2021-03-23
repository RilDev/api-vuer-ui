export const HistoryLog = {
  props: { log: Object, index: Number },
  emits: ["loadHistoryLog", "deleteHistoryLog"],
  computed: {
    containerTitle() {
      return this.log.results.length > 0 ? "Load Log" : "";
    },
    classesContainer() {
      return {
        "bg-gray-50": this.log.results.length > 0,
        "hover:bg-gray-100": this.log.results.length > 0,
        "bg-gray-200": this.log.results.length === 0,
        "cursor-pointer": this.log.results.length > 0,
      };
    },
    classesSearch() {
      return {
        "line-through": this.log.results.length === 0,
      };
    },
  },
  template: /*html*/ `
    <li
      :title="containerTitle"
      :class="classesContainer"
      class="mb-2 px-5 py-2 rounded-md shadow-md flex justify-between relative transition"
      @click="$emit('loadHistoryLog', log)"
    >
      <span :class="classesSearch">{{log.search}}</span>
      <span class="text-gray-400 pr-7">{{log.date}}</span>
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
    `,
};
