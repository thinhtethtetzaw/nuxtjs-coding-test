<template>
	<section>
		<!-- Banner -->
		<div class="relative">
			<div
				class="relative mb-[-60px] h-[60vh] overflow-hidden rounded-3xl p-28 before:absolute before:inset-0 before:bg-black/40 before:content-['']"
			>
				<img
					src="/images/hotel-banner.png"
					alt="banner"
					class="absolute inset-0 -z-1 h-full w-full object-cover"
				/>
				<div class="relative z-10 space-y-4 text-left text-white">
					<h1 class="text-6xl font-bold opacity-80 drop-shadow">
						Find Your Dream Stay
					</h1>
					<p class="mt-8 text-xl opacity-80 drop-shadow">
						From luxury retreats to cozy hideaways,<br />
						we help you find the perfect place to create lasting memories
					</p>
					<Button variant="primary" size="md" roundedFull> Explore </Button>
				</div>
			</div>
			<div
				class="absolute -bottom-10 left-1/2 z-10 w-5/6 -translate-x-1/2 transform"
			>
				<div
					class="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-lg"
				>
					<FilterHotelsSearch v-model="searchQuery" @select="onHotelSelect" />
				</div>
			</div>
		</div>

		<!-- Hotel List -->
		<div class="mx-auto mt-36 grid grid-cols-12 gap-6">
			<div class="col-span-3">
				<div class="sticky top-6">
					<h2 class="mb-6 text-2xl font-bold text-gray-900">Filter By:</h2>
					<div v-if="isHotelsLoading">
						<SkeletonLoading />
					</div>
					<div v-else class="flex flex-col gap-6">
						<FilterPriceRange v-model="filters" />
						<FilterAmenities
							v-model="filters.selectedAmenities"
							:amenities="availableAmenities"
						/>
					</div>
				</div>
			</div>
			<div class="col-span-9 px-4">
				<div v-if="error" class="text-center">
					{{ error.message || "Failed to load hotels" }}
				</div>
				<div
					v-if="isHotelsLoading"
					class="flex items-center justify-center py-10"
				>
					<SpinnerLoading :is-loading="isHotelsLoading" />
				</div>
				<div v-if="!isHotelsLoading">
					<h2 class="mb-4 text-2xl font-bold">Discover Our Collection</h2>
					<div
						v-if="filteredHotels.data.length === 0"
						class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-12 text-center"
					>
						<div class="mb-4 rounded-full bg-gray-100 p-4">
							<HotelIcon color="gray" :size="32" />
						</div>
						<h3 class="mb-2 text-xl font-semibold text-gray-800">
							No Hotels Found
						</h3>
						<p class="mb-4 text-gray-600">
							We couldn't find any hotels matching your criteria. <br />Try
							adjusting your filters or search for a different location.
						</p>
					</div>
					<div v-else class="grid grid-cols-3 gap-4">
						<HotelCard
							v-for="hotel in filteredHotels.data"
							:key="hotel.id || hotel.slug"
							:hotel="hotel"
							@book-now="onHotelBook"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, computed } from "vue"
import { HotelCard } from "~/components/hotel"
import { SpinnerLoading, SkeletonLoading } from "~/components/common"
import { HotelIcon } from "lucide-vue-next"
import Button from "~/components/common/Button.vue"

const searchQuery = ref("")
const filters = ref({
	priceMin: null,
	priceMax: null,
	selectedAmenities: [],
})

const availableAmenities = computed(() => {
	if (!hotels.value?.data) return []

	const amenitiesMap = new Map()

	hotels.value.data.forEach((hotel) => {
		hotel.amenities?.forEach((amenity) => {
			// Use amenity ID as key to prevent duplicates
			if (!amenitiesMap.has(amenity.id)) {
				amenitiesMap.set(amenity.id, amenity)
			}
		})
	})

	return Array.from(amenitiesMap.values()).sort((a, b) =>
		a.name.localeCompare(b.name),
	)
})

const {
	data: hotels,
	pending: isHotelsLoading,
	error,
} = useApi("/api/hotels", {
	method: "POST",
	key: "hotels-list",
	cache: true,
	immediate: true,
	watch: false,
})

const filteredHotels = computed(() => {
	if (!hotels.value?.data) return { data: [] }

	return {
		data: hotels.value.data.filter((hotel) => {
			// Price filter
			if (filters.value.priceMin && hotel.avg_price < filters.value.priceMin)
				return false
			if (filters.value.priceMax && hotel.avg_price > filters.value.priceMax)
				return false

			// Amenities filter
			if (filters.value.selectedAmenities.length > 0) {
				const hotelAmenityIds = new Set(hotel.amenities?.map((a) => a.id) || [])
				if (
					!filters.value.selectedAmenities.every((id) =>
						hotelAmenityIds.has(id),
					)
				) {
					return false
				}
			}

			return true
		}),
	}
})

const onHotelSelect = (selectedHotel) => {
	searchQuery.value = selectedHotel.hotel_name
	hotels.value = { data: [selectedHotel] }
}

const onHotelBook = (hotel) => {
	console.log("Booking hotel:", hotel.hotel_name)
}
</script>
