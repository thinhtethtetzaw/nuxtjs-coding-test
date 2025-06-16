<template>
	<section class="py-4 md:py-8">
		<div
			v-if="showStickyForm"
			class="fixed top-0 left-0 z-50 w-full bg-white shadow-lg transition-all md:hidden"
		>
			<FilterHotelSearchBar
				:fullWidth="true"
				@search-hotels="customSearchHotels"
				@clear-search="getAllHotels"
			/>
		</div>

		<div
			class="relative container mx-auto hidden max-w-7xl px-12 md:block lg:px-8 xl:px-0"
		>
			<div
				class="relative mb-[-60px] h-[40vh] overflow-hidden rounded-3xl p-10 before:absolute before:inset-0 before:bg-black/40 before:content-[''] lg:h-[60vh] lg:p-12 xl:p-28 2xl:h-[40vh]"
			>
				<img
					:src="bannerImage"
					alt="banner"
					class="absolute inset-0 -z-1 h-full w-full object-cover"
				/>
				<div class="relative z-10 space-y-4 text-left text-white">
					<h1
						class="text-3xl font-bold opacity-80 drop-shadow lg:text-5xl xl:text-6xl"
					>
						Find Your Dream Stay
					</h1>
					<p
						class="mt-4 text-base opacity-80 drop-shadow lg:mt-5 lg:text-xl xl:mt-8"
					>
						From luxury retreats to cozy hideaways,<br />
						we help you find the perfect place to create lasting memories
					</p>
				</div>
			</div>
			<div
				ref="bannerFormRef"
				class="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 transform xl:-bottom-10"
			>
				<FilterHotelSearchBar
					:fullWidth="false"
					@search-hotels="customSearchHotels"
					@clear-search="getAllHotels"
				/>
			</div>
		</div>

		<!-- Hotel List -->
		<div
			class="container mx-auto grid max-w-7xl grid-cols-12 gap-4 px-12 md:mt-28 lg:gap-8 lg:px-8 xl:mt-36 xl:grid-cols-13 xl:gap-12 xl:px-0"
		>
			<div class="col-span-12 flex items-center justify-between lg:col-span-4">
				<div class="block bg-red-500 md:hidden">Hello</div>
				<Filter
					:is-hotels-loading="isGetAllHotelsLoading || isCustomSearchLoading"
					:filters="filters"
					@update:filters="filters = $event"
					:available-amenities="availableAmenities"
				/>
			</div>
			<div class="col-span-12 lg:col-span-8 xl:col-span-9">
				<div
					v-if="isGetAllHotelsLoading || isCustomSearchLoading"
					class="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
				>
					<template v-for="n in 5">
						<HotelCardSkeleton />
					</template>
				</div>
				<div v-if="!isGetAllHotelsLoading && !isCustomSearchLoading">
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
					<div
						v-else
						class="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
					>
						<HotelCard
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
import { useCustomHotelSearch } from "~/composables/useCustomHotelSearch"
import { useGetAllHotels } from "~/composables/useGetAllHotels"

const { getParam } = useUrlParams()

const showStickyForm = ref(false)
const bannerFormRef = ref(null)
const hotels = ref([])

const filters = ref({
	priceMin: null,
	priceMax: null,
	selectedAmenities: [],
})

const {
	data: customSearchData,
	loading: isCustomSearchLoading,
	searchHotels,
} = useCustomHotelSearch()

const {
	data: allHotelsData,
	loading: isGetAllHotelsLoading,
	getAllHotels,
} = useGetAllHotels()

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
		await getAllHotelsHandler()
	}
})

const getAllHotelsHandler = async () => {
	await getAllHotels()
	if (allHotelsData.value && allHotelsData.value.data) {
		hotels.value = allHotelsData.value
	}
}

const customSearchHotels = async () => {
	await searchHotels(getParam("search"))
	if (customSearchData.value && customSearchData.value.data) {
		hotels.value = customSearchData.value
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
