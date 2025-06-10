<template>
  <section class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Hotel List</h1>

    <SearchBox v-model="searchQuery" @select="handleSuggestionSelect" />

    <div v-if="pending" class="text-gray-500 text-center py-8">
      Loading hotels...
    </div>

    <div v-else-if="error" class="text-center py-8">
      {{ error.message || "Failed to load hotels" }}
    </div>

    <div v-else>
      <div v-if="hotels?.data?.length" class="grid grid-cols-3 gap-6">
        <HotelCard
          v-for="hotel in hotels.data"
          :key="hotel.id || hotel.slug"
          :hotel="hotel"
          @book-now="handleBooking"
        />
      </div>

      <div v-else class="text-gray-600 text-center py-8">
        {{
          searchQuery
            ? "No hotels found matching your search."
            : "No hotels found."
        }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");

// API calls
const {
  data: hotels,
  pending,
  error,
} = await useApi("/api/hotels", {
  method: "POST",
  server: false,
  immediate: true,
  watch: false,
});

const handleSuggestionSelect = (suggestion) => {
  searchQuery.value = suggestion.hotel_name;
  hotels.value = { data: [suggestion] };
};

const handleBooking = (hotel) => {
  console.log("Booking hotel:", hotel.hotel_name);
};
</script>
