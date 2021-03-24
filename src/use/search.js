import axios from "axios";
import debounce from "lodash/debounce";

// Composition API
import { ref } from "vue";

export default function useSearch() {
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
    date: "01/01/2021 12:00:00 PM",
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
  const isSearchDelay = ref(false);

  // methods
  const getResults = debounce(async function (inputValue) {
    /* debounce to avoid GET at every key stroke */
    // update input search value
    search.value = inputValue;

    // reset isHistoryLog
    isHistoryLog.value = false;

    // cancel isSearchDelay
    isSearchDelay.value = false;

    // if search is not empty, GET API response
    if (search.value !== "") {
      isSearching.value = true;
      try {
        // start GET
        const response = await axios.get(
          `https://api.publicapis.org/entries?title=${search.value}`
        );
        // end GET
        results.value = response.data.entries || [];
      } catch {
        console.error("Error! API didn't respond!");
      } finally {
        isSearching.value = false;
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
    inputRefs.value[reference].focus();
  }

  function removeFromFavorites(index) {
    // when click on delete, remove corresponding result
    favoriteResults.value.splice(index, 1);
    // force state update
    favoriteResults.value = [...favoriteResults.value];
  }

  function addToFavorites(index) {
    // when click on add, add corresponding result to favorites
    // if index is -1, then it is the tutorial's example
    if (index === -1) {
      favoriteResults.value = [tutorialResult];
      // force state update
      favoriteResults.value = [...favoriteResults.value];
    } else {
      favoriteResults.value = [...favoriteResults.value, results.value[index]];
    }
  }

  function loadHistoryLog(log) {
    search.value = log.search;
    results.value = log.results;
    isHistoryLog.value = true;
  }

  function deleteHistoryLog(index) {
    // when click on delete, remove corresponding result
    // if index = -1, it is the tutorial history log
    if (index !== -1) {
      searchHistory.value.splice(index, 1);
      updateLocalStorage();
    }
  }

  function updateLocalStorage() {
    // update favorite results
    localStorage.setItem(
      "favorite-results",
      JSON.stringify(favoriteResults.value)
    );

    // update search history
    // limit the array length to 20 items
    const slicedArray = searchHistory.value.slice(0, 20);
    localStorage.setItem("search-history", JSON.stringify(slicedArray));
  }

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
    isSearchDelay,
    // methods
    getResults,
    clearSearch,
    removeFromFavorites,
    addToFavorites,
    loadHistoryLog,
    deleteHistoryLog,
    updateLocalStorage,
  };
}
