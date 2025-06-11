<template>
	<div
		class="hotel-card flex h-full min-h-[370px] flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
	>
		<!-- Image -->
		<div class="h-44 w-full flex-shrink-0 md:h-48">
			<img
				:src="hotel.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
				:alt="hotel.hotel_name"
				class="h-full w-full object-cover"
			/>
		</div>
		<!-- Details -->
		<div class="flex h-full flex-1 flex-col justify-between p-4 md:p-6">
			<div>
				<div class="mb-1 flex items-center gap-2">
					<h2 class="text-lg font-bold md:text-xl">
						{{ hotel.hotel_name }}
					</h2>
					<div class="ml-2 flex items-center">
						<span
							v-for="n in Number(hotel.rating)"
							:key="n"
							class="text-sm text-yellow-400"
							>★</span
						>
					</div>
				</div>
				<div class="mb-2 text-sm text-gray-500">
					{{ hotel.address?.[0]?.cityName }}
				</div>
				<div class="mb-2 flex min-h-[32px] flex-wrap gap-2">
					<span
						v-for="amenity in hotel.amenities?.slice(0, 4)"
						:key="amenity.id"
						class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
					>
						{{ amenity.name }}
					</span>
				</div>
			</div>
			<div class="mt-2 flex items-end justify-between">
				<div class="text-xs text-gray-500">2 Adults, 0 Children</div>
				<div class="flex flex-col items-end">
					<div class="flex items-center gap-1">
						<span class="text-lg font-bold text-gray-800 md:text-2xl"
							>{{ hotel.currency }} {{ hotel.avg_price }}</span
						>
						<span class="text-xs text-gray-500">/ night</span>
					</div>
					<button
						class="mt-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
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
})

defineEmits(["book-now"])

// Placeholder logic for rating label, score, and review count
const ratingScore = computed(() => props.hotel.rating || "7.5")
const reviewCount = computed(() => props.hotel.review_count || 174)
const ratingLabel = computed(() => {
	const score = Number(ratingScore.value)
	if (score >= 9) return "Wonderful"
	if (score >= 8) return "Very good"
	if (score >= 7) return "Good"
	if (score >= 6) return "Pleasant"
	return "Review"
})
</script>

<style scoped>
.hotel-card {
	margin-bottom: 0.5rem;
}
</style>
