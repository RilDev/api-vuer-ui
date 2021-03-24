<template>
  <main
    class="flex-grow flex flex-col h-full sm:grid sm:grid-cols-2 sm:gap-x-7 sm:items-stretch"
  >
    <section class="sm:flex sm:flex-col sm:overflow-hidden">
      <header>
        <Title></Title>
      </header>
      <SearchBlock>
        <SearchInput
          v-model:value="search"
          :placeholder="placeholder"
          v-model:inputRefs="inputRefs"
          reference="search-input-1"
          :has-search="hasSearch"
          @getResults="getResults"
          @clearSearch="clearSearch"
        ></SearchInput>
      </SearchBlock>
      <div class="hidden sm:mt-6 sm:flex sm:flex-col sm:items-center">
        <RobotIcon
          :has-search="hasSearch"
          :has-results="hasResults"
          :is-searching="isSearching"
        ></RobotIcon>
        <div>{{ resultsPlaceholder }}</div>
      </div>
      <div
        class="hidden sm:mt-6 sm:flex sm:flex-col sm:flex-grow sm:overflow-hidden"
      >
        <div class="text-3xl text-center font-bold">Recent History</div>
        <ul v-if="searchHistory.length" class="mt-4 h-full overflow-auto">
          <HistoryLog
            v-for="(log, index) in searchHistory"
            :log="log"
            :index="index"
            :key="index"
            @loadHistoryLog="loadHistoryLog"
            @deleteHistoryLog="deleteHistoryLog"
          ></HistoryLog>
        </ul>
        <div v-else class="text-center text-gray-500 mt-4">No logs yet...</div>
      </div>
    </section>
    <section class="overflow-auto">
      <div v-if="!hasResults" class="mt-6 flex flex-col items-center sm:hidden">
        <RobotIcon
          :has-search="hasSearch"
          :has-results="hasResults"
          :is-searching="isSearching"
        ></RobotIcon>
        <div>{{ resultsPlaceholder }}</div>
      </div>
      <div v-if="!hasFavorites && !hasResults" class="mt-6 sm:mt-0">
        <div class="text-center text-3xl font-bold mb-4">Tutorial</div>
        <div class="text-lg">1) Enter your search in the search input</div>
        <SearchInput
          v-model:value="search"
          :placeholder="placeholder"
          v-model:inputRefs="inputRefs"
          reference="search-input-2"
          @getResults="getResults"
          @clearSearch="clearSearch"
        ></SearchInput>
        <div class="text-lg mt-3 mb-3">2) Add an API to your favorites</div>
        <ul>
          <ResultItem
            :index="-1"
            :result="tutorialResult"
            :favorite-results="favoriteResults"
            :has-search="hasSearch"
            @removeFromFavorites="removeFromFavorites"
            @addToFavorites="addToFavorites"
          ></ResultItem>
        </ul>
        <div class="text-lg -mt-2">
          3) Reset the search by clicking on the
          <svg width="24" height="24" viewBox="0 0 24 24" class="inline-block">
            <path
              d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
            />
          </svg>
        </div>
        <SearchInput
          v-model:value="search"
          :placeholder="placeholder"
          v-model:inputRefs="inputRefs"
          reference="search-input-3"
          @getResults="getResults"
          @clearSearch="clearSearch"
        ></SearchInput>
        <div class="text-lg my-3">
          4) Load previous searches by clicking an history log
        </div>
        <ul>
          <HistoryLog
            :log="tutorialHistoryLog"
            :index="-1"
            @loadHistoryLog="loadHistoryLog"
            @deleteHistoryLog="deleteHistoryLog"
          ></HistoryLog>
        </ul>
      </div>
      <ResultsList v-if="hasFavorites && !hasResults">
        <ResultItem
          v-for="(result, index) in favoriteResults"
          :key="index"
          :index="index"
          :result="result"
          :favorite-results="favoriteResults"
          :has-search="hasSearch"
          @removeFromFavorites="removeFromFavorites"
          @addToFavorites="addToFavorites"
        ></ResultItem>
      </ResultsList>
      <ResultsList v-if="hasResults">
        <ResultItem
          v-for="(result, index) in results"
          :key="index"
          :index="index"
          :result="result"
          :favorite-results="favoriteResults"
          :has-search="hasSearch"
          @removeFromFavorites="removeFromFavorites"
          @addToFavorites="addToFavorites"
        ></ResultItem>
      </ResultsList>
    </section>
  </main>
  <Footer></Footer>
</template>

<script>
import axios from "axios";
import debounce from "lodash/debounce";
import moment from "moment";

// Composition API
import { ref, watch, onMounted } from "vue";

// import components
import Title from "./components/Title.vue";
import SearchBlock from "./components/SearchBlock.vue";
import SearchInput from "./components/SearchInput.vue";
import RobotIcon from "./components/RobotIcon.vue";
import ResultsList from "./components/ResultsList.vue";
import ResultItem from "./components/ResultItem.vue";
import HistoryLog from "./components/HistoryLog.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Title,
    SearchBlock,
    SearchInput,
    RobotIcon,
    ResultsList,
    ResultItem,
    HistoryLog,
    Footer,
  },
  setup() {
    // global refs
    const inputRefs = ref({});

    // static values
    const placeholder = "ex: robot";
    const tutorialResult = {
      API: "Lingua Robot",
      Description:
        "Word definitions, pronunciations, synonyms, antonyms and others",
      Auth: "apiKey",
      HTTPS: true,
      Cors: "yes",
      Link: "https://www.linguarobot.io",
      Category: "Dictionaries",
    };
    const tutorialHistoryLog = {
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
    };

    // dynamic values
    const search = ref("");
    const results = ref([]);
    const favoriteResults = ref([]);
    const searchHistory = ref([]);

    const hasSearch = ref(false);
    const hasResults = ref(false);
    const hasFavorites = ref(false);
    const isSearching = ref(false);
    const isHistoryLog = ref(false);

    // methods
    const getResults = debounce(async function (inputValue) {
      /* debounce to avoid GET at every key stroke */
      // update input search value
      search.value = inputValue;

      // reset isHistoryLog
      isHistoryLog.value = false;

      // if search is not empty, GET API response
      if (search.value !== "") {
        try {
          // start GET
          isSearching.value = true;
          const response = await axios.get(
            `https://api.publicapis.org/entries?title=${search.value}`
          );
          // end GET
          isSearching.value = false;
          results.value = response.data.entries || [];
        } catch {
          console.error("Error! API didn't respond!");
        }
      } else {
        // if search input is empty, clean all previous results
        results.value = [];
      }
    }, 300);

    function clearSearch(reference) {
      search.value = "";
      results.value = [];
      // reset isHistoryLog
      isHistoryLog.value = false;

      // focus on the clicked input
      console.log(' inputRefs.value ' +  JSON.stringify(inputRefs.value, null, ' '))
      inputRefs.value[reference].focus();
    }

    // function updateLocalStorage() {
    //   // update favorite results
    //   localStorage.setItem(
    //     "favorite-results",
    //     JSON.stringify(favoriteResults.value)
    //   );

    //   // update search history
    //   // limit the array length to 20 items
    //   const slicedArray = searchHistory.value.slice(0, 20);
    //   localStorage.setItem("search-history", JSON.stringify(slicedArray));
    // }

    // function timeNow() {
    //   return moment().format("MMMM Do YYYY, h:mm:ss a");
    // }

    return {
      // global refs
      inputRefs,
      // static values
      placeholder,
      tutorialResult,
      tutorialHistoryLog,
      // dynamic values
      search,
      results,
      favoriteResults,
      searchHistory,
      hasSearch,
      hasResults,
      hasFavorites,
      isSearching,
      isHistoryLog,
      // methods
      getResults,
      clearSearch,
      // updateLocalStorage,
      // timeNow,
    };
  },
  watch: {
    search() {
      if (this.search.length === 0) {
      console.log("🚀 ~ file: App.vue ~ line 291 ~ clearSearch ~  inputRefs.value",  inputRefs.value)
      console.log("🚀 ~ file: App.vue ~ line 291 ~ clearSearch ~  inputRefs.value",  inputRefs.value)
      console.log("🚀 ~ file: App.vue ~ line 291 ~ clearSearch ~  inputRefs.value",  inputRefs.value)
      console.log("🚀 ~ file: App.vue ~ line 291 ~ clearSearch ~ inputRefs.value", inputRefs.value)
      console.log("🚀 ~ file: App.vue ~ line 291 ~ clearSearch ~ inputRefs.value", inputRefs.value)
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
    // getResults: debounce(async function (inputValue) {
    //   /* debounce to avoid GET at every key stroke */
    //   // update input search value
    //   this.search = inputValue;

    //   // reset isHistoryLog
    //   this.isHistoryLog = false;

    //   // if search is not empty, GET API response
    //   if (this.search !== "") {
    //     try {
    //       // start GET
    //       this.isSearching = true;
    //       const response = await axios.get(
    //         `https://api.publicapis.org/entries?title=${this.search}`
    //       );
    //       // end GET
    //       this.isSearching = false;
    //       this.results = response.data.entries || [];
    //     } catch {
    //       console.error("Error! API didn't respond!");
    //     }
    //   } else {
    //     // if search input is empty, clean all previous results
    //     this.results = [];
    //   }
    // }, 300),
    // clearSearch(reference) {
    //   this.search = "";
    //   this.results = [];
    //   // reset isHistoryLog
    //   this.isHistoryLog = false;

    //   // focus on the clicked input
    //   this.$refs[reference].$el.getElementsByTagName("input")[0].focus();
    // },
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
};
</script>
