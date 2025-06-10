<template>
  <div
    class="hotel-card flex flex-col bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg min-h-[370px] h-full"
  >
    <!-- Image -->
    <div class="w-full h-44 md:h-48 flex-shrink-0">
      <img
        :src="hotel.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
        :alt="hotel.hotel_name"
        class="w-full h-full object-cover"
      />
    </div>
    <!-- Details -->
    <div class="flex flex-col flex-1 justify-between p-4 md:p-6 h-full">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h2 class="text-lg md:text-xl font-bold">
            {{ hotel.hotel_name }}
          </h2>
          <div class="flex items-center ml-2">
            <span
              v-for="n in Number(hotel.rating)"
              :key="n"
              class="text-yellow-400 text-sm"
              >★</span
            >
          </div>
        </div>
        <div class="text-gray-500 text-sm mb-2">
          {{ hotel.address?.[0]?.cityName }}
        </div>
        <div class="flex flex-wrap gap-2 mb-2 min-h-[32px]">
          <span
            v-for="amenity in hotel.amenities?.slice(0, 4)"
            :key="amenity.id"
            class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
          >
            {{ amenity.name }}
          </span>
        </div>
      </div>
      <div class="flex items-end justify-between mt-2">
        <div class="text-xs text-gray-500">2 Adults, 0 Children</div>
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-1">
            <span class="text-lg md:text-2xl font-bold text-gray-800"
              >{{ hotel.currency }} {{ hotel.avg_price }}</span
            >
            <span class="text-xs text-gray-500">/ night</span>
          </div>
          <button
            class="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            @click="$emit('book-now', hotel)"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hotel: {
    type: Object,
    required: true,
  },
});

defineEmits(["book-now"]);

// Placeholder logic for rating label, score, and review count
const ratingScore = computed(() => props.hotel.rating || "7.5");
const reviewCount = computed(() => props.hotel.review_count || 174);
const ratingLabel = computed(() => {
  const score = Number(ratingScore.value);
  if (score >= 9) return "Wonderful";
  if (score >= 8) return "Very good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Pleasant";
  return "Review";
});
</script>

<style scoped>
.hotel-card {
  margin-bottom: 0.5rem;
}
</style>
