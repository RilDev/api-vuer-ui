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
          :is-search-delay="isSearchDelay"
          :is-history-log="isHistoryLog"
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
          :is-search-delay="isSearchDelay"
          :is-history-log="isHistoryLog"
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
// Composition API
import { watch, onMounted } from "vue";
import useSearch from "/src/use/search";
import useTime from "/src/use/time";

// import components
import Title from "/src/components/Title.vue";
import SearchBlock from "/src/components/SearchBlock.vue";
import SearchInput from "/src/components/SearchInput.vue";
import RobotIcon from "/src/components/RobotIcon.vue";
import ResultsList from "/src/components/ResultsList.vue";
import ResultItem from "/src/components/ResultItem.vue";
import HistoryLog from "/src/components/HistoryLog.vue";
import Footer from "/src/components/Footer.vue";

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
    // use
    const {
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
      // computed
      resultsPlaceholder,
      // methods
      getResults,
      clearSearch,
      removeFromFavorites,
      addToFavorites,
      loadHistoryLog,
      deleteHistoryLog,
      updateLocalStorage,
    } = useSearch();
    const { timeNow } = useTime();

    // watch
    watch(search, () => {
      if (search.value.length === 0) {
        hasSearch.value = false;
      } else {
        hasSearch.value = true;
        isSearchDelay.value = true;
      }
    });

    watch(results, () => {
      if (results.value.length === 0) {
        hasResults.value = false;
      } else {
        hasResults.value = true;
      }

      // save result in search history
      // don't save if the search is empty
      if (hasSearch.value && !isHistoryLog.value) {
        searchHistory.value.unshift({
          search: search.value,
          results: results.value,
          date: timeNow(),
        });
        updateLocalStorage();
      }
    });

    watch(favoriteResults, () => {
      updateLocalStorage();

      if (favoriteResults.value.length === 0) {
        hasFavorites.value = false;
      } else {
        hasFavorites.value = true;
      }
    });

    onMounted(() => {
      // init localStorage
      if (localStorage.getItem("favorite-results") === null) {
        localStorage.setItem("favorite-results", JSON.stringify([]));
      }
      favoriteResults.value = JSON.parse(
        localStorage.getItem("favorite-results")
      );

      if (localStorage.getItem("search-history") === null) {
        localStorage.setItem("search-history", JSON.stringify([]));
      }
      searchHistory.value = JSON.parse(localStorage.getItem("search-history"));
    });

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
      // computed
      resultsPlaceholder,
      // methods
      getResults,
      clearSearch,
      removeFromFavorites,
      addToFavorites,
      loadHistoryLog,
      deleteHistoryLog,
      updateLocalStorage,
    };
  },
};
</script>
