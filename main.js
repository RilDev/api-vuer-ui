// bootstrap app
const App = {
  data() {
    return {
      placeholder: "ex: robot",
      search: "",
      results: [],
      hasSearch: false,
      hasResults: false,
      hasFavorites: false,
      isSearching: false,
      isHistoryLog: false,
      favoriteResults: [],
      searchHistory: [],
    };
  },
  watch: {
    search() {
      if (this.search.length === 0) {
        this.hasSearch = false;
      } else {
        this.hasSearch = true;
      }
    },
    results() {
      if (this.results.length === 0) {
        this.hasResults = false;
      } else {
        this.hasResults = true;
      }

      // save result in search history
      // don't save if the search is empty
      if (this.hasSearch && !this.isHistoryLog) {
        this.searchHistory.unshift({
          search: this.search,
          result: this.results,
          date: this.timeNow(),
        });
        this.updateLocalStorage();
      }
    },
    favoriteResults() {
      this.updateLocalStorage();

      if (this.favoriteResults.length === 0) {
        this.hasFavorites = false;
      } else {
        this.hasFavorites = true;
      }
    },
  },
  methods: {
    getResults: _.debounce(async function (event) {
      /* debounce to avoid GET at every key stroke */
      // update input search value
      this.search = event.target.value;

      // reset isHistoryLog
      this.isHistoryLog = false;

      // if search is not empty, GET API response
      if (this.search !== "") {
        try {
          // start GET
          this.isSearching = true;
          const response = await axios.get(
            `https://api.publicapis.org/entries?title=${this.search}`
          );
          // end GET
          this.isSearching = false;
          this.results = response.data.entries || [];
        } catch {
          console.error("Error! API didn't respond!");
        }
      } else {
        // if search input is empty, clean all previous results
        this.results = [];
      }
    }, 300),
    clearSearch() {
      this.search = "";
      this.results = [];
      // reset isHistoryLog
      this.isHistoryLog = false;
    },
    deleteResult(index) {
      // when click on delete, remove corresponding result
      this.favoriteResults.splice(index, 1);
      this.updateLocalStorage();
    },
    favoriteResult(index) {
      // when click on delete, remove corresponding result
      this.favoriteResults = [...this.favoriteResults, this.results[index]];
    },
    loadHistoryLog(log) {
      this.search = log.search;
      this.results = log.result;
      this.isHistoryLog = true;
    },
    deleteHistoryLog(index) {
      // when click on delete, remove corresponding result
      this.searchHistory.splice(index, 1);
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      // update favorite results
      localStorage.setItem(
        "favorite-results",
        JSON.stringify(this.favoriteResults)
      );

      // update search history
      // limit the array length to 20 items
      const slicedArray = this.searchHistory.slice(0, 20);
      localStorage.setItem("search-history", JSON.stringify(slicedArray));
    },
    timeNow() {
      return moment().format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  computed: {
    resultsPlaceholder() {
      // load history log
      if (this.isHistoryLog && this.hasResults) {
        return "Data retrieved from memory!";
      }
      // load history log with no resutls search
      if (this.isHistoryLog && !this.hasResults) {
        return "That one was a bad one!";
      }
      // no search yet
      if (!this.hasSearch) {
        return "Awaiting search request!";
      }
      // is searching
      if (this.hasSearch && this.isSearching) {
        return "Searching...";
      }
      // no search results
      if (this.hasSearch && !this.hasResults) {
        return "No results found!";
      }
      // has search results
      if (this.hasSearch && this.hasResults) {
        return "Here you go!";
      }
    },
  },
  mounted() {
    // init localStorage
    if (localStorage.getItem("favorite-results") === null) {
      localStorage.setItem("favorite-results", JSON.stringify([]));
    }
    this.favoriteResults = JSON.parse(localStorage.getItem("favorite-results"));

    if (localStorage.getItem("search-history") === null) {
      localStorage.setItem("search-history", JSON.stringify([]));
    }
    this.searchHistory = JSON.parse(localStorage.getItem("search-history"));
  },
};

const app = Vue.createApp(App);

// create global components
app.component("app-title", {
  template: /*html*/ `
  <h1 class="text-4xl text-center text-blue-500 font-bold">API Vuer</h1>
  <div class="text-center">
    Powered by
    <a href="https://api.publicapis.org/" target="_blank" class="text-blue-500">Public APIs</a>
  </div>
  `,
});

app.component("search", {
  props: ["value", "placeholder"],
  emits: ["clearSearch"],
  template: /*html*/ `
  <div class="mt-6 text-center">
    <div class="text-lg">Do you have an API about:</div>
    <div class="relative">
      <input
      type="text"
      :placeholder="placeholder"
      :value="value"
      class="rounded-md border-gray-900 mt-3 px-5 py-3 shadow-sm w-full"
      />
      <div @click="$emit('clear-search')" title="Clear Search" class="absolute top-6 right-4 cursor-pointer"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" /></svg></div>
    </div>
  </div>
  `,
});

app.component("results-list", {
  template: /*html*/ `
  <ul class="mt-6 w-full sm:mt-0">
    <slot></slot>
  </ul>
  `,
});

app.component("result-item", {
  props: ["index", "result", "favoriteResults"],
  emits: ["deleteResult", "favoriteResult"],
  data() {
    return {
      linkIcon:
        '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" /></svg>',
      authIcon:
        '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65Z" /></svg>',
      httpsIcon:
        '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg>',
      corsIcon:
        '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V14H13V15H11V9H13V10H15V9A2,2 0 0,0 13,7H11Z" /></svg>',
      isAuth: false,
      isHttps: false,
      isCors: false,
      isFavorite: false,
    };
  },
  computed: {
    computedIsAuth() {
      return this.result.Auth === "apiKey";
    },
    computedIsHttps() {
      return this.result.HTTPS;
    },
    computedIsCors() {
      return this.result.Cors === "yes";
    },
    computedIsFavorite() {
      for (const result of this.favoriteResults) {
        if (result.Link === this.result.Link) {
          return true;
        }
      }
      return false;
    },
    classes() {
      return {
        "bg-green-50": this.computedIsFavorite,
        "bg-gray-50": !this.computedIsFavorite,
      };
    },
  },
  template: /*html*/ `
  <li :class="classes" class="mb-3 p-4 rounded-md shadow-md sm:mb-5">
    <div class="flex flex-wrap space-x-1">
      <div class="text-xl font-bold">{{result.API}}</div>
      <span v-html="authIcon" v-if="computedIsAuth" title="API Key Required"></span>
      <span v-html="httpsIcon" v-if="computedIsHttps" title="HTTPS"></span>
      <span v-html="corsIcon" v-if="computedIsCors" title="CORS"></span>
    </div>
    <div class="mt-2 text-gray-800">{{result.Description}}</div>
    <div class="flex mt-2"><span v-html="linkIcon" class="mr-1"></span> <a :href="result.Link" target="_blank" class="text-blue-500 break-all">{{result.Link}}</a></div>
    <div class="flex justify-end">
    <button v-if="!computedIsFavorite" @click="$emit('favoriteResult', index)" class="border-green-700 hover:bg-green-700 border text-green-700 hover:text-white px-2 py-1 text-xs uppercase tracking-wider rounded-md">add to favorite</button>
    <button v-else @click="$emit('deleteResult', index)" class="border-red-700 hover:bg-red-700 border text-red-700 hover:text-white px-2 py-1 text-xs uppercase tracking-wider rounded-md">remove from favorite</button>
    </div>
  </li>
  `,
});

app.component("robot-icon", {
  props: ["hasSearch", "isSearching", "hasResults"],
  data() {
    return {
      robotNoSearch:
        "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z",
      robotSearching:
        "M22 14H21C21 10.13 17.87 7 14 7H13V5.73C13.6 5.39 14 4.74 14 4C14 2.9 13.11 2 12 2S10 2.9 10 4C10 4.74 10.4 5.39 11 5.73V7H10C6.13 7 3 10.13 3 14H2C1.45 14 1 14.45 1 15V18C1 18.55 1.45 19 2 19H3V20C3 21.11 3.9 22 5 22H19C20.11 22 21 21.11 21 20V19H22C22.55 19 23 18.55 23 18V15C23 14.45 22.55 14 22 14M21 17H19V20H5V17H3V16H5V14C5 11.24 7.24 9 10 9H14C16.76 9 19 11.24 19 14V16H21V17M8.5 13.5L10.86 15.86L9.68 17.04L8.5 15.86L7.32 17.04L6.14 15.86L8.5 13.5M15.5 13.5L17.86 15.86L16.68 17.04L15.5 15.86L14.32 17.04L13.14 15.86L15.5 13.5Z",
      robotNoResult:
        "M10.62 14.44L9.56 15.5L10.62 16.56L9.56 17.62L8.5 16.56L7.44 17.62L6.38 16.56L7.44 15.5L6.38 14.44L7.44 13.38L8.5 14.44L9.56 13.38L10.62 14.44M16.56 13.38L15.5 14.44L14.44 13.38L13.38 14.44L14.44 15.5L13.38 16.56L14.44 17.62L15.5 16.56L16.56 17.62L17.62 16.56L16.56 15.5L17.62 14.44L16.56 13.38M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z",
      robotHasResults:
        "M10.5 15.5C10.5 15.87 10.4 16.2 10.22 16.5C9.88 15.91 9.24 15.5 8.5 15.5S7.12 15.91 6.78 16.5C6.61 16.2 6.5 15.87 6.5 15.5C6.5 14.4 7.4 13.5 8.5 13.5S10.5 14.4 10.5 15.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16M15.5 13.5C14.4 13.5 13.5 14.4 13.5 15.5C13.5 15.87 13.61 16.2 13.78 16.5C14.12 15.91 14.76 15.5 15.5 15.5S16.88 15.91 17.22 16.5C17.4 16.2 17.5 15.87 17.5 15.5C17.5 14.4 16.61 13.5 15.5 13.5Z",
    };
  },
  computed: {
    robotState() {
      // no search yet
      if (!this.hasSearch) {
        return this.robotNoSearch;
      }
      // is searching
      if (this.hasSearch && this.isSearching) {
        return this.robotSearching;
      }
      // no search results
      if (this.hasSearch && !this.hasResults) {
        return this.robotNoResult;
      }
      // has search results
      if (this.hasSearch && this.hasResults) {
        return this.robotHasResults;
      }
    },
  },
  template: /*html*/ `
  <svg
    width="150"
    height="150"
    viewBox="0 0 24 24"
    class="fill-current"
  >
    <path
      :d="this.robotState"
    />
  </svg>
  `,
});

app.component("history-log", {
  props: ["log", "index"],
  emits: ["loadHistoryLog", "deleteHistoryLog"],
  computed: {
    containerTitle() {
      return this.log.result.length > 0 ? "Load Log" : "";
    },
    classesContainer() {
      return {
        "bg-gray-50": this.log.result.length > 0,
        "hover:bg-gray-100": this.log.result.length > 0,
        "bg-gray-200": this.log.result.length === 0,
        "cursor-pointer": this.log.result.length > 0,
      };
    },
    classesSearch() {
      return {
        "line-through": this.log.result.length === 0,
      };
    },
  },
  template: /*html*/ `
  <li
    :title="containerTitle"
    :class="classesContainer"
    class="mb-2 px-5 py-2 rounded-md shadow-md flex justify-between relative"
    @click="$emit('loadHistoryLog', log)"
  >
    <span :class="classesSearch">{{log.search}}</span>
    <span class="text-gray-400 pr-7">{{log.date}}</span>
    <div
      title="Delete Log"
      class="absolute top-2 right-4 cursor-pointer"
      @click="$emit('deleteHistoryLog', index)"
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
        />
      </svg>
    </div>
  </li>
  `,
});

// mount app
const vm = app.mount("#app");
