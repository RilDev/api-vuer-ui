<template>
  <div class="mt-6 sm:mt-0">
    <div class="text-center text-3xl font-bold mb-4">Tutorial</div>
    <div class="text-lg">1) Enter your search in the search input</div>
    <slot name="tutorial-1"></slot>
    <div class="text-lg mt-3 mb-3">2) Add an API to your favorites</div>
    <slot name="tutorial-2"></slot>
    <div class="text-lg -mt-2">
      3) Reset the search by clicking on the
      <svg width="24" height="24" viewBox="0 0 24 24" class="inline-block">
        <path
          d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
        />
      </svg>
    </div>
    <slot name="tutorial-3"></slot>
    <div class="text-lg my-3">
      4) Load previous searches by clicking an history log
    </div>
    <slot name="tutorial-4"></slot>
  </div>
</template>
