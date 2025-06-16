<template>
	<section>
		<CommonStickySearchBar
			:show="showStickyForm"
			@search-hotels="customSearchHotels"
		/>

		<!-- Banner -->
		<div class="relative">
			<div
				class="relative mb-[-60px] h-[60vh] overflow-hidden rounded-3xl p-28 before:absolute before:inset-0 before:bg-black/40 before:content-['']"
			>
				<img
					:src="bannerImage"
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
				</div>
			</div>
			<div
				ref="bannerFormRef"
				class="absolute -bottom-20 left-1/2 z-10 w-5/6 -translate-x-1/2 transform"
			>
				<div
					class="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-lg"
				>
					<div class="w-full space-y-6">
						<FilterRoomSearch @search-hotels="customSearchHotels" />
						<FilterHotelsSearch />
					</div>
				</div>
			</div>
		</div>

		<!-- Hotel List -->
		<div class="mx-auto mt-48 grid grid-cols-12 gap-6">
			<div class="col-span-3">
				<div class="sticky top-24">
					<h2 class="mb-6 text-2xl font-bold text-gray-900">Filter By:</h2>
					<div v-if="isHotelsLoading">
						<CommonSkeletonLoading />
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
				<div
					v-if="isHotelsLoading"
					class="flex items-center justify-center py-10"
				>
					<CommonSpinnerLoading :is-loading="true" />
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
					<div v-else class="flex flex-col gap-y-8">
						<HotelCardTemp
							v-for="hotel in filteredHotels.data"
							:key="hotel.id + hotel.slug"
							:hotel="hotel"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { HotelIcon } from "lucide-vue-next"
import { useUrlParams } from "~/composables/useUrlParams"
import bannerImage from "~/assets/images/hotel-banner.png"

const { getParam } = useUrlParams()

const showStickyForm = ref(false)
const bannerFormRef = ref(null)
const hotels = ref([])
const isHotelsLoading = ref(false)

const filters = ref({
	priceMin: null,
	priceMax: null,
	selectedAmenities: [],
})

const defaultParams = {
	search: null,
	check_in: new Date().toISOString().split("T")[0],
	check_out: new Date(Date.now() + 86400000).toISOString().split("T")[0],
	adults: 1,
	rooms: 1,
}

const hasCustomParams = computed(() => {
	const currentParams = {
		search: getParam("search"),
		check_in: getParam("check_in") || defaultParams.check_in,
		check_out: getParam("check_out") || defaultParams.check_out,
		adults: Number(getParam("adults")) || defaultParams.adults,
		rooms: Number(getParam("rooms")) || defaultParams.rooms,
	}

	if (!currentParams.search) {
		return !Object.keys(defaultParams).every((key) => {
			if (key === "search") return true
			return currentParams[key]?.toString() === defaultParams[key]?.toString()
		})
	}

	return true
})

const availableAmenities = computed(() => {
	if (!hotels.value?.data) return []

	const amenitiesMap = new Map()
	hotels.value.data.forEach((hotel) => {
		hotel.amenities?.forEach((amenity) => {
			if (!amenitiesMap.has(amenity.id)) {
				amenitiesMap.set(amenity.id, { ...amenity, count: 1 })
			} else {
				const existingAmenity = amenitiesMap.get(amenity.id)
				amenitiesMap.set(amenity.id, {
					...existingAmenity,
					count: existingAmenity.count + 1,
				})
			}
		})
	})

	return Array.from(amenitiesMap.values()).sort((a, b) =>
		a.name.localeCompare(b.name),
	)
})

const handleScroll = () => {
	if (bannerFormRef.value) {
		const rect = bannerFormRef.value.getBoundingClientRect()
		showStickyForm.value = rect.bottom < 0
	}
}

onMounted(async () => {
	window.addEventListener("scroll", handleScroll)

	if (hasCustomParams.value) {
		await customSearchHotels()
	} else {
		await getAllHotels()
	}
})

const getAllHotels = async () => {
	isHotelsLoading.value = true
	try {
		const response = await $fetch("/api/hotels", {
			method: "POST",
		})

		if (response.data) {
			hotels.value = response
		}
	} catch (error) {
		console.error("Hotel search error:", error)
	} finally {
		isHotelsLoading.value = false
	}
}

const customSearchHotels = async () => {
	isHotelsLoading.value = true
	try {
		const response = await $fetch("/api/hotels/custom-search", {
			method: "POST",
			body: {
				search: getParam("search"),
			},
		})

		if (response.data) {
			hotels.value = response
		}
	} catch (error) {
		console.error("Hotel search error:", error)
	} finally {
		isHotelsLoading.value = false
	}
}

const filteredHotels = computed(() => {
	if (!hotels.value?.data) return { data: [] }

	return {
		data: hotels.value.data.filter((hotel) => {
			if (filters.value.priceMin && hotel.avg_price < filters.value.priceMin)
				return false
			if (filters.value.priceMax && hotel.avg_price > filters.value.priceMax)
				return false

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

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll)
})
</script>
