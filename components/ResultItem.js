export const ResultItem = {
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
};
