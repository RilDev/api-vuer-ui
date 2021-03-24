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
      <RobotBlock
        :has-search="hasSearch"
        :has-results="hasResults"
        :is-searching="isSearching"
        :is-search-delay="isSearchDelay"
        :is-history-log="isHistoryLog"
        class="hidden sm:mt-6 sm:flex sm:flex-col sm:items-center"
      >
        <RobotIcon
          :has-search="hasSearch"
          :has-results="hasResults"
          :is-searching="isSearching"
          :is-search-delay="isSearchDelay"
          :is-history-log="isHistoryLog"
        ></RobotIcon>
      </RobotBlock>
      <HistoryLogList :search-history="searchHistory">
        <HistoryLog
          v-for="(log, index) in searchHistory"
          :log="log"
          :index="index"
          :key="index"
          @loadHistoryLog="loadHistoryLog"
          @deleteHistoryLog="deleteHistoryLog"
        ></HistoryLog>
      </HistoryLogList>
    </section>
    <section class="overflow-auto">
      <RobotBlock
        :has-search="hasSearch"
        :has-results="hasResults"
        :is-searching="isSearching"
        :is-search-delay="isSearchDelay"
        :is-history-log="isHistoryLog"
        class="mt-6 flex flex-col items-center sm:hidden"
      >
        <RobotIcon
          :has-search="hasSearch"
          :has-results="hasResults"
          :is-searching="isSearching"
          :is-search-delay="isSearchDelay"
          :is-history-log="isHistoryLog"
        ></RobotIcon>
      </RobotBlock>
      <Tutorial v-if="!hasFavorites && !hasResults">
        <template #tutorial-1>
          <SearchInput
            v-model:value="search"
            :placeholder="placeholder"
            v-model:inputRefs="inputRefs"
            reference="search-input-2"
            @getResults="getResults"
            @clearSearch="clearSearch"
          ></SearchInput>
        </template>
        <template #tutorial-2>
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
        </template>
        <template #tutorial-3>
          <SearchInput
            v-model:value="search"
            :placeholder="placeholder"
            v-model:inputRefs="inputRefs"
            reference="search-input-3"
            @getResults="getResults"
            @clearSearch="clearSearch"
          ></SearchInput>
        </template>
        <template #tutorial-4>
          <ul>
            <HistoryLog
              :log="tutorialHistoryLog"
              :index="-1"
              @loadHistoryLog="loadHistoryLog"
              @deleteHistoryLog="deleteHistoryLog"
            ></HistoryLog>
          </ul>
        </template>
      </Tutorial>
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
import RobotBlock from "/src/components/RobotBlock.vue";
import RobotIcon from "/src/components/RobotIcon.vue";
import ResultsList from "/src/components/ResultsList.vue";
import ResultItem from "/src/components/ResultItem.vue";
import HistoryLogList from "/src/components/HistoryLogList.vue";
import HistoryLog from "/src/components/HistoryLog.vue";
import Tutorial from "/src/components/Tutorial.vue";
import Footer from "/src/components/Footer.vue";

export default {
  components: {
    Title,
    SearchBlock,
    SearchInput,
    RobotBlock,
    RobotIcon,
    ResultsList,
    ResultItem,
    HistoryLogList,
    HistoryLog,
    Tutorial,
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
