export const SearchInput = {
  props: { value: String, placeholder: String, reference: String },
  emits: ["clearSearch", "getResults", "update:value"],
  template: /*html*/ `
    <div class="relative">
      <input
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('update:value', $event.target.value);$emit('getResults', $event)"
      class="rounded-md border-gray-900 mt-3 px-5 py-3 shadow-sm w-full focus:outline-none"
      />
      <div @click="$emit('clearSearch', reference)" title="Clear Search" class="absolute top-6 right-4 cursor-pointer"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" /></svg></div>
    </div>
    `,
};