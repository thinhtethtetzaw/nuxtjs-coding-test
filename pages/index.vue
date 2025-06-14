<template>
	<section>
		<!-- Sticky Search Bar -->
		<Transition
			name="sticky-form"
			enter-active-class="transition-all duration-500 ease-out"
			leave-active-class="transition-all duration-300 ease-in"
			enter-from-class="opacity-0 -translate-y-full"
			enter-to-class="opacity-100 translate-y-0"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-full"
		>
			<div
				v-if="showStickyForm"
				class="fixed top-0 right-0 left-0 z-50 mx-auto border-b border-gray-200 bg-white px-20 py-3 shadow-lg"
			>
				<form @submit.prevent="searchRooms" class="w-full">
					<div class="flex items-center gap-3">
						<div class="relative w-80 flex-shrink-0">
							<FilterHotelsSearch
								v-model="searchQuery"
								@select="onHotelSelect"
								:placeholder="
									selectedHotel ? selectedHotel.hotel_name : 'Choose hotel...'
								"
								class="compact"
							/>
						</div>

						<div class="flex-1">
							<FilterRoomSearch
								v-model="roomSearchParams"
								:is-searching="isRoomSearching"
								:is-compact="true"
								@search="searchHotels"
							/>
						</div>
					</div>
				</form>
			</div>
		</Transition>

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
						<FilterHotelsSearch
							v-model="searchQuery"
							@select="onHotelSelect"
							:placeholder="
								selectedHotel ? selectedHotel.hotel_name : 'Search hotels...'
							"
						/>

						<FilterRoomSearch
							v-model="roomSearchParams"
							:is-searching="isRoomSearching"
							@search="searchHotels"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Room Search Results -->
		<div
			v-if="roomSearchResults.length > 0"
			class="mx-auto mt-48 mb-12"
			:class="{ 'pt-20': showStickyForm }"
		>
			<div class="mb-6">
				<h2 class="text-3xl font-bold text-gray-900">
					Available Rooms at {{ selectedHotel?.hotel_name }}
				</h2>
				<p class="mt-2 text-gray-600">
					{{ roomSearchResults.length }} rooms available for your dates
				</p>
			</div>
			<div class="grid grid-cols-1 gap-6">
				<div
					v-for="room in roomSearchResults"
					:key="room.id"
					class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
				>
					<div class="p-6">
						<div class="flex flex-col gap-6 lg:flex-row">
							<div class="h-48 w-full flex-shrink-0 lg:h-40 lg:w-64">
								<img
									:src="room.gallery?.[0]?.url || '/placeholder-room.jpg'"
									:alt="room.room_type"
									class="h-full w-full rounded-lg object-cover"
								/>
							</div>
							<div class="flex-1">
								<h4 class="mb-3 text-xl font-semibold text-gray-900">
									{{ room.room_type }}
								</h4>
								<div class="mb-4 space-y-2">
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<UsersIcon class="size-4 text-gray-600" />
										<span>Max {{ room.max_occupancy }} guests</span>
									</div>
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<RulerIcon class="size-4 text-gray-600" />
										<span>{{ room.size_measurement || "Spacious room" }}</span>
									</div>
									<div
										v-for="amenity in room.amenities?.slice(0, 2)"
										:key="amenity.id"
										class="flex items-center gap-2 text-sm text-gray-600"
									>
										<CheckIcon class="text-primary size-3" />
										<span>{{ amenity.amenity_name }}</span>
									</div>
								</div>
							</div>
							<div class="w-full space-y-3 lg:w-96">
								<div
									v-for="ratePlan in room.rate_plans?.slice(0, 2)"
									:key="ratePlan.id"
									class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
								>
									<div class="mb-3 flex items-start justify-between">
										<span class="font-medium text-gray-900">{{
											ratePlan.rate_plan_name
										}}</span>
										<div class="text-right">
											<div class="flex items-baseline gap-2">
												<span class="text-sm text-gray-400 line-through">
													{{ selectedHotel?.currency_code }}
													{{
														Math.round(
															(ratePlan.pivot?.price ||
																selectedHotel?.avg_price) * 1.15,
														)
													}}
												</span>
												<span class="text-xl font-semibold text-gray-900">
													{{ selectedHotel?.currency_code }}
													{{
														ratePlan.pivot?.price || selectedHotel?.avg_price
													}}
												</span>
											</div>
											<p class="text-xs text-gray-500">per night</p>
										</div>
									</div>
									<div class="mb-3">
										<p class="mb-2 text-sm font-medium text-gray-700">
											Inclusions
										</p>
										<div class="space-y-1">
											<div
												v-if="ratePlan.include_breakfast"
												class="flex items-center gap-2 text-xs text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>Free Breakfast</span>
											</div>
											<div
												v-for="benefit in ratePlan.benefits?.slice(0, 2)"
												:key="benefit.id"
												class="flex items-center gap-2 text-xs text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>{{ benefit.hint }}</span>
											</div>
											<div
												v-if="!ratePlan.no_cancel_ind"
												class="flex items-center gap-2 text-xs text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>Free Cancellation</span>
											</div>
										</div>
									</div>
									<CommonButton class="w-full">Book Now</CommonButton>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Room Search Loading -->
		<div
			v-if="isRoomSearching"
			class="mx-auto mt-48 mb-12 flex items-center justify-center py-12"
			:class="{ 'pt-20': showStickyForm }"
		>
			<div class="text-center">
				<CommonSpinnerLoading :is-loading="isRoomSearching" />
				<p class="mt-4 text-sm text-gray-600">Searching available rooms...</p>
			</div>
		</div>

		<!-- Room Search Error -->
		<div
			v-if="roomSearchError"
			class="mx-auto mt-48 mb-12 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
			:class="{ 'pt-20': showStickyForm }"
		>
			<div class="mb-3 flex items-center justify-center gap-2 text-red-600">
				<AlertTriangleIcon class="size-5 text-red-600" />
				<p class="text-sm font-medium">{{ roomSearchError }}</p>
			</div>
			<button
				@click="searchRooms"
				class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
			>
				Try Again
			</button>
		</div>

		<!-- Hotel List -->
		<div
			v-if="!isRoomSearching"
			class="mx-auto mt-48 grid grid-cols-12 gap-6"
			:class="{ '': showStickyForm }"
		>
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
				<div v-if="error" class="text-center">
					{{ error.message || "Failed to load hotels" }}
				</div>
				<div
					v-if="isHotelsLoading"
					class="flex items-center justify-center py-10"
				>
					<CommonSpinnerLoading :is-loading="isHotelsLoading" />
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
							@book-now="selectHotelForBooking"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import {
	HotelIcon,
	UsersIcon,
	RulerIcon,
	AlertTriangleIcon,
	XIcon,
	SearchIcon,
	ChevronDownIcon,
	MinusIcon,
	PlusIcon,
	CheckIcon,
} from "lucide-vue-next"

const route = useRoute()
const router = useRouter()

const searchQuery = ref("")
const selectedHotel = ref(null)
const roomSearchResults = ref([])
const roomSearchError = ref("")
const isRoomSearching = ref(false)
const showStickyForm = ref(false)
const bannerFormRef = ref(null)

// Room search parameters
const roomSearchParams = reactive({
	check_in: "",
	check_out: "",
	rooms: 1,
	adults: 2,
	children: 0,
	age_of_children: "",
})

const filters = ref({
	priceMin: null,
	priceMax: null,
	selectedAmenities: [],
})

// Function to update URL parameters
const updateUrlParams = () => {
	const query = { ...route.query }

	// Always set these fields
	query.checkin = roomSearchParams.check_in
	query.checkout = roomSearchParams.check_out
	query.rooms = roomSearchParams.rooms.toString()
	query.adults = roomSearchParams.adults.toString()
	query.children = roomSearchParams.children.toString()

	// Only include ages if set
	if (roomSearchParams.age_of_children) {
		query.ages = roomSearchParams.age_of_children
	} else {
		delete query.ages
	}

	// Hotel search
	if (searchQuery.value) {
		query.search = searchQuery.value
	} else {
		delete query.search
	}

	// Update URL without triggering navigation
	router.replace({ query })
}

// Function to initialize from URL parameters
const initializeFromUrl = () => {
	const query = route.query

	// Hotel search
	if (query.search) {
		searchQuery.value = String(query.search)
	}

	// Room search parameters
	if (query.checkin) {
		roomSearchParams.check_in = String(query.checkin)
	}

	if (query.checkout) {
		roomSearchParams.check_out = String(query.checkout)
	}

	if (query.rooms) {
		roomSearchParams.rooms = parseInt(String(query.rooms)) || 1
	}

	if (query.adults) {
		roomSearchParams.adults = parseInt(String(query.adults)) || 2
	}

	if (query.children) {
		roomSearchParams.children = parseInt(String(query.children)) || 0
	}

	if (query.ages) {
		roomSearchParams.age_of_children = String(query.ages)
	}
}

// Function to find and set selected hotel from URL
const findHotelFromUrl = async () => {
	const hotelSlug = String(route.query.hotel || "")
	if (hotelSlug && hotels.value?.data) {
		const hotel = hotels.value.data.find((h) => h.slug === hotelSlug)
		if (hotel) {
			selectedHotel.value = hotel
			searchQuery.value = hotel.hotel_name
		}
	}
}

// Computed properties
const today = computed(() => {
	return new Date().toISOString().split("T")[0]
})

const minCheckoutDate = computed(() => {
	if (!roomSearchParams.check_in) return today.value
	const checkIn = new Date(roomSearchParams.check_in)
	checkIn.setDate(checkIn.getDate() + 1)
	return checkIn.toISOString().split("T")[0]
})

const isRoomFormValid = computed(() => {
	const allChildrenHaveAges =
		roomSearchParams.children === 0 ||
		(childrenAges.value.length === roomSearchParams.children &&
			childrenAges.value.every((age) => age !== ""))

	return (
		roomSearchParams.check_in &&
		roomSearchParams.check_out &&
		roomSearchParams.check_in !== roomSearchParams.check_out &&
		new Date(roomSearchParams.check_in) <
			new Date(roomSearchParams.check_out) &&
		allChildrenHaveAges
	)
})

const availableAmenities = computed(() => {
	if (!hotels.value?.data) return []

	const amenitiesMap = new Map()
	hotels.value.data.forEach((hotel) => {
		hotel.amenities?.forEach((amenity) => {
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

// Scroll handler for sticky form
const handleScroll = () => {
	if (bannerFormRef.value) {
		const rect = bannerFormRef.value.getBoundingClientRect()
		showStickyForm.value = rect.bottom < 0
	}
}

// Methods
const onHotelSelect = (hotel) => {
	selectedHotel.value = hotel
	searchQuery.value = hotel.hotel_name
	// Clear previous room search results
	roomSearchResults.value = []
	roomSearchError.value = ""
	updateUrlParams()
	if (hotel && hotel.slug) {
		searchQuery.value = hotel.hotel_name
		router.push({
			path: `/hotels/${hotel.slug}`,
			query: {
				...route.query,
				search: hotel.hotel_name,
			},
		})
		selectedHotel.value = hotel
	}
}

const selectHotelForBooking = (hotel) => {
	selectedHotel.value = hotel
	searchQuery.value = hotel.hotel_name
	updateUrlParams()
	// Scroll to room search form
	window.scrollTo({ top: 0, behavior: "smooth" })
}

const clearSelectedHotel = () => {
	selectedHotel.value = null
	searchQuery.value = ""
	roomSearchResults.value = []
	roomSearchError.value = ""
	updateUrlParams()
}

// Room search methods
const incrementRooms = () => {
	if (roomSearchParams.rooms < 8) {
		roomSearchParams.rooms++
		updateUrlParams()
	}
}

const decrementRooms = () => {
	if (roomSearchParams.rooms > 1) {
		roomSearchParams.rooms--
		updateUrlParams()
	}
}

const incrementAdults = () => {
	if (roomSearchParams.adults < 8) {
		roomSearchParams.adults++
		updateUrlParams()
	}
}

const decrementAdults = () => {
	if (roomSearchParams.adults > 1) {
		roomSearchParams.adults--
		updateUrlParams()
	}
}

const incrementChildren = () => {
	if (roomSearchParams.children < 4) {
		roomSearchParams.children++
		updateChildrenAges()
		updateUrlParams()
	}
}

const decrementChildren = () => {
	if (roomSearchParams.children > 0) {
		roomSearchParams.children--
		updateChildrenAges()
		updateUrlParams()
	}
}

const updateChildrenAges = () => {
	const childrenCount = parseInt(roomSearchParams.children)
	if (childrenCount === 0) {
		childrenAges.value = []
		roomSearchParams.age_of_children = ""
	} else {
		childrenAges.value = Array(childrenCount)
			.fill("")
			.map((_, index) => childrenAges.value[index] || "")
	}
	updateAgeOfChildrenString()
}

const updateAgeOfChildrenString = () => {
	if (roomSearchParams.children === 0) {
		roomSearchParams.age_of_children = ""
	} else {
		const validAges = childrenAges.value.filter((age) => age !== "")
		roomSearchParams.age_of_children = validAges.join(",")
	}
	updateUrlParams()
}

const searchRooms = async () => {
	if (!selectedHotel.value) {
		// Show error or prompt to select hotel
		roomSearchError.value = "Please select a hotel first"
		return
	}

	showStickyForm.value = false
	isRoomSearching.value = true
	roomSearchError.value = ""
	roomSearchResults.value = []

	try {
		const payload = {
			check_in: roomSearchParams.check_in,
			check_out: roomSearchParams.check_out,
			rooms: roomSearchParams.rooms.toString(),
			adults: roomSearchParams.adults.toString(),
			age_of_children: roomSearchParams.age_of_children || undefined,
		}

		const response = await $fetch(
			`/api/hotels/${selectedHotel.value.slug}/rooms`,
			{
				method: "POST",
				body: payload,
			},
		)

		if (response.data && response.data.rooms) {
			roomSearchResults.value = response.data.rooms
		} else {
			roomSearchResults.value = []
		}
	} catch (error) {
		console.error("Room search error:", error)
		roomSearchError.value =
			error.data?.message || "Failed to search rooms. Please try again."
	} finally {
		isRoomSearching.value = false
	}
}

const searchHotels = async () => {
	isRoomSearching.value = true
	roomSearchError.value = ""
	roomSearchResults.value = []

	try {
		const response = await $fetch("/api/hotels/custom-search", {
			method: "POST",
			body: {
				search: searchQuery.value,
			},
		})

		if (response.data) {
			hotels.value = response
		}
	} catch (error) {
		console.error("Hotel search error:", error)
		roomSearchError.value =
			error.data?.message || "Failed to search hotels. Please try again."
	} finally {
		isRoomSearching.value = false
	}
}

// Initialize default dates
onMounted(async () => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const dayAfter = new Date()
	dayAfter.setDate(dayAfter.getDate() + 2)

	// Set default dates if not in URL
	if (!route.query.checkin) {
		roomSearchParams.check_in = tomorrow.toISOString().split("T")[0]
	}
	if (!route.query.checkout) {
		roomSearchParams.check_out = dayAfter.toISOString().split("T")[0]
	}

	// Initialize from URL parameters
	initializeFromUrl()

	// Add scroll listener
	window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll)
})

// Watch for hotels data to be loaded, then find hotel from URL
watch(
	hotels,
	async (newHotels) => {
		if (newHotels?.data) {
			await nextTick()
			await findHotelFromUrl()
		}
	},
	{ immediate: true },
)

// Watch for check-in date changes
watch(
	() => roomSearchParams.check_in,
	(newCheckIn) => {
		if (
			newCheckIn &&
			roomSearchParams.check_out &&
			new Date(newCheckIn) >= new Date(roomSearchParams.check_out)
		) {
			const checkIn = new Date(newCheckIn)
			checkIn.setDate(checkIn.getDate() + 1)
			roomSearchParams.check_out = checkIn.toISOString().split("T")[0]
		}
		updateUrlParams()
	},
)

// Watch for check-out date changes
watch(
	() => roomSearchParams.check_out,
	() => {
		updateUrlParams()
	},
)

// Watch for search query changes
watch(searchQuery, (newQuery) => {
	if (!selectedHotel.value || selectedHotel.value.hotel_name !== newQuery) {
		// Only update URL if it's a manual search, not a hotel selection
		updateUrlParams()
	}
})

// Watch for filter changes
watch(
	filters,
	() => {
		updateUrlParams()
	},
	{ deep: true },
)

// Watch for route changes (browser back/forward)
watch(
	() => route.query,
	(newQuery, oldQuery) => {
		// Only reinitialize if the query actually changed
		if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
			initializeFromUrl()
			nextTick(() => {
				if (hotels.value?.data) {
					findHotelFromUrl()
				}
			})
		}
	},
	{ deep: true },
)
</script>
