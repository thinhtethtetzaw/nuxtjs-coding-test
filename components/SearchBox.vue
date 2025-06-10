<template>
  <div class="mb-6 relative">
    <input
      :value="modelValue"
      type="text"
      placeholder="Search hotels..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      @input="handleInput"
      @keydown.enter.prevent="emitSearch"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- Search Results -->
    <div
      v-if="showPopover && suggestions.length"
      class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-72 overflow-auto"
    >
      <div
        v-for="suggestion in suggestions"
        :key="suggestion.id || suggestion.slug"
        class="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        <div class="flex-1">
          <div class="font-medium text-gray-900">
            {{ suggestion.hotel_name }}
          </div>
          <div
            v-if="suggestion.city_name || suggestion.country_name"
            class="text-sm text-gray-500"
          >
            {{ suggestion.city_name }} {{ suggestion.country_name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="absolute right-3 top-2.5">
      <div
        class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "select", "search"]);

const suggestions = ref([]);
const isLoading = ref(false);
const showPopover = ref(false);
let debounceTimeout = null;

const searchQuery = ref("");

const { data, execute } = useLazyApi(
  "/api/hotels/search",
  {
    method: "POST",
  },
  computed(() => ({ search: searchQuery.value }))
);

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

const handleFocus = () => {
  if (suggestions.value.length > 0) showPopover.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    showPopover.value = false;
  }, 200);
};

const selectSuggestion = (suggestion) => {
  emit("select", suggestion);
  showPopover.value = false;
};

const emitSearch = () => {
  emit("search", suggestions.value);
};

const fetchSuggestions = async (query) => {
  if (!query.trim()) {
    suggestions.value = [];
    showPopover.value = false;
    return;
  }
  isLoading.value = true;
  try {
    searchQuery.value = query;
    await execute();
    suggestions.value = data.value?.data || [];
    showPopover.value = suggestions.value.length > 0;
  } catch (e) {
    suggestions.value = [];
    showPopover.value = false;
  }
  isLoading.value = false;
};

watch(
  () => props.modelValue,
  (val) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  }
);
</script>
