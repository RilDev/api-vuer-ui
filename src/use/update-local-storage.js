export default function updateLocalStorage(favoriteResults, searchHistory) {
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