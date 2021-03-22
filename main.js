// import { createApp } from "vue";
// import axios from "axios";
// import _ from "lodash";
// import moment from "moment";

// import components
import { Title } from "./components/Title";
import { SearchBlock } from "./components/SearchBlock";
import { SearchInput } from "./components/SearchInput";
import { RobotIcon } from "./components/RobotIcon";

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
      tutorialResult: {
        API: "Lingua Robot",
        Description:
          "Word definitions, pronunciations, synonyms, antonyms and others",
        Auth: "apiKey",
        HTTPS: true,
        Cors: "yes",
        Link: "https://www.linguarobot.io",
        Category: "Dictionaries",
      },
      tutorialHistoryLog: {
        search: "robot",
        results: [
          {
            API: "Lingua Robot",
            Description:
              "Word definitions, pronunciations, synonyms, antonyms and others",
            Auth: "apiKey",
            HTTPS: true,
            Cors: "yes",
            Link: "https://www.linguarobot.io",
            Category: "Dictionaries",
          },
        ],
        date: "March 22nd 2021, 2:14:38 pm",
      },
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
          results: this.results,
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
    clearSearch(reference) {
      this.search = "";
      this.results = [];
      // reset isHistoryLog
      this.isHistoryLog = false;

      // focus on the clicked input
      this.$refs[reference].$el.getElementsByTagName("input")[0].focus();
    },
    removeFromFavorites(index) {
      // when click on delete, remove corresponding result
      this.favoriteResults.splice(index, 1);
      // force state update
      this.favoriteResults = [...this.favoriteResults];
    },
    addToFavorites(index) {
      // when click on add, add corresponding result to favorites
      // if index is -1, then it is the tutorial's example
      if (index === -1) {
        this.favoriteResults = [this.tutorialResult];
        // force state update
        this.favoriteResults = [...this.favoriteResults];
      } else {
        this.favoriteResults = [...this.favoriteResults, this.results[index]];
      }
    },
    loadHistoryLog(log) {
      this.search = log.search;
      this.results = log.results;
      this.isHistoryLog = true;
    },
    deleteHistoryLog(index) {
      // when click on delete, remove corresponding result
      // if index = -1, it is the tutorial history log
      if (index !== -1) {
        this.searchHistory.splice(index, 1);
        this.updateLocalStorage();
      }
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
  components: {
    Title,
    SearchBlock,
    SearchInput,
    RobotIcon,
  },
  template: /*html*/ `
  <main
        class="flex-grow flex flex-col h-full sm:grid sm:grid-cols-2 sm:gap-x-7 sm:items-stretch"
      >
        <section class="sm:flex sm:flex-col sm:overflow-hidden">
          <header>
            <Title></Title>
          </header>
          <SearchBlock>
            <SearchInput
              :value="search"
              :placeholder="placeholder"
              ref="search-input-1"
              reference="search-input-1"
              :has-search="hasSearch"
              @input="getResults"
              @clear-search="clearSearch"
            ></SearchInput>
          </SearchBlock>
          <div class="hidden sm:mt-6 sm:flex sm:flex-col sm:items-center">
            <RobotIcon
              :has-search="hasSearch"
              :has-results="hasResults"
              :is-searching="isSearching"
            ></RobotIcon>
            <div>{{resultsPlaceholder}}</div>
          </div>
          <div
            class="hidden sm:mt-6 sm:flex sm:flex-col sm:flex-grow sm:overflow-hidden"
          >
            <div class="text-3xl text-center font-bold">Recent History</div>
            <ul v-if="searchHistory.length" class="mt-4 h-full overflow-auto">
              <history-log
                v-for="(log, index) in searchHistory"
                :log="log"
                :index="index"
                :key="index"
                @load-history-log="loadHistoryLog"
                @delete-history-log="deleteHistoryLog"
              ></history-log>
            </ul>
            <div v-else class="text-center text-gray-400 mt-4">
              No logs yet...
            </div>
          </div>
        </section>
        <section class="overflow-auto">
          <div
            v-if="!hasResults"
            class="mt-6 flex flex-col items-center sm:hidden"
          >
            <RobotIcon
              :has-search="hasSearch"
              :has-results="hasResults"
              :is-searching="isSearching"
            ></RobotIcon>
            <div>{{resultsPlaceholder}}</div>
          </div>
          <div v-if="!hasFavorites && !hasResults" class="mt-6 sm:mt-0">
            <div class="text-center text-3xl font-bold mb-4">Tutorial</div>
            <div class="text-lg">1) Enter your search in the search input</div>
            <SearchInput
              :value="search"
              :placeholder="placeholder"
              ref="search-input-2"
              reference="search-input-2"
              @input="getResults"
              @clear-search="clearSearch"
            ></SearchInput>
            <div class="text-lg mt-3 mb-3">2) Add an API to your favorites</div>
            <ul>
              <result-item
                :index="-1"
                :result="tutorialResult"
                :favorite-results="favoriteResults"
                :has-search="hasSearch"
                @remove-from-favorites="removeFromFavorites"
                @add-to-favorites="addToFavorites"
              ></result-item>
            </ul>
            <div class="text-lg -mt-2">
              3) Reset the search by clicking on the
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="inline-block"
              >
                <path
                  d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
                />
              </svg>
            </div>
            <SearchInput
              :value="search"
              :placeholder="placeholder"
              ref="search-input-3"
              reference="search-input-3"
              @input="getResults"
              @clear-search="clearSearch"
            ></SearchInput>
            <div class="text-lg my-3">
              4) Load previous searches by clicking an history log
            </div>
            <ul>
              <history-log
                :log="tutorialHistoryLog"
                :index="-1"
                @load-history-log="loadHistoryLog"
                @delete-history-log="deleteHistoryLog"
              ></history-log>
            </ul>
          </div>
          <results-list v-if="hasFavorites && !hasResults">
            <result-item
              v-for="(result, index) in favoriteResults"
              :key="index"
              :index="index"
              :result="result"
              :favorite-results="favoriteResults"
              :has-search="hasSearch"
              @remove-from-favorites="removeFromFavorites"
              @add-to-favorites="addToFavorites"
            ></result-item>
          </results-list>
          <results-list v-if="hasResults">
            <result-item
              v-for="(result, index) in results"
              :key="index"
              :index="index"
              :result="result"
              :favorite-results="favoriteResults"
              :has-search="hasSearch"
              @remove-from-favorites="removeFromFavorites"
              @add-to-favorites="addToFavorites"
            ></result-item>
          </results-list>
        </section>
      </main>
      <footer class="flex items-center justify-center h-16">
        <span>
          <a href="https://rildev.website" target="_blank" class="text-blue-500"
            >RilDev</a
          > &copy; 2021
        </span>
      </footer>
  `,
};

const app = Vue.createApp(App);

// create global components

app.component("results-list", {
  template: /*html*/ `
  <ul class="mt-6 sm:mt-0">
    <slot></slot>
  </ul>
  `,
});

app.component("result-item", {
  props: ["index", "result", "favoriteResults", "hasSearch"],
  emits: ["removeFromFavorites", "addToFavorites"],
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
    computedFavoriteIndex() {
      for (const [index, result] of this.favoriteResults.entries()) {
        // if the favorite is viewed from the favorite list, then send the current index
        // else, send calculated value corresponding to the index in the favoriteResults array
        if (!this.hasSearch) {
          return this.index;
        } else {
          if (result.Link === this.result.Link) {
            return index;
          }
        }
      }
    },
    classes() {
      return {
        "bg-green-50": this.computedIsFavorite,
        "bg-gray-50": !this.computedIsFavorite,
      };
    },
  },
  template: /*html*/ `
  <li :class="classes" class="mb-3 px-5 py-4 rounded-md shadow-md sm:mb-5">
    <div class="flex flex-wrap space-x-1">
      <div class="text-xl font-bold">{{result.API}}</div>
      <span v-html="authIcon" v-if="computedIsAuth" title="API Key Required"></span>
      <span v-html="httpsIcon" v-if="computedIsHttps" title="HTTPS"></span>
      <span v-html="corsIcon" v-if="computedIsCors" title="CORS"></span>
    </div>
    <div class="mt-2 text-gray-800">{{result.Description}}</div>
    <div class="flex mt-2"><span v-html="linkIcon" class="mr-1"></span> <a :href="result.Link" target="_blank" class="text-blue-500 break-all">{{result.Link}}</a></div>
    <div class="flex justify-end">
    <button v-if="!computedIsFavorite" @click="$emit('addToFavorites', index)" class="border-green-700 hover:bg-green-700 border text-green-700 hover:text-white px-2 py-1 text-xs uppercase tracking-wider rounded-md transition">add to favorite</button>
    <button v-else @click="$emit('removeFromFavorites', computedFavoriteIndex)" class="border-red-700 hover:bg-red-700 border text-red-700 hover:text-white px-2 py-1 text-xs uppercase tracking-wider rounded-md transition">remove from favorite</button>
    </div>
  </li>
  `,
});

app.component("history-log", {
  props: ["log", "index"],
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
});

// mount app
const vm = app.mount("#app");
