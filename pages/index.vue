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
				</div>
			</div>
			<div
				class="absolute -bottom-20 left-1/2 z-10 w-5/6 -translate-x-1/2 transform"
			>
				<div
					class="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-lg"
				>
					<!-- Unified Search Form -->
					<div class="w-full space-y-6">
						<!-- Hotel Selection -->
						<div>
							<FilterHotelsSearch
								v-model="searchQuery"
								@select="onHotelSelect"
								:placeholder="
									selectedHotel ? selectedHotel.hotel_name : 'Search hotels...'
								"
							/>

							<!-- Selected Hotel Display -->
							<div
								v-if="selectedHotel"
								class="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 p-3"
							>
								<div class="flex-shrink-0">
									<img
										:src="
											selectedHotel.gallery?.[0]?.url ||
											'/placeholder-hotel.jpg'
										"
										:alt="selectedHotel.hotel_name"
										class="h-12 w-12 rounded-lg object-cover"
									/>
								</div>
								<div class="flex-1">
									<h4 class="font-medium text-gray-900">
										{{ selectedHotel.hotel_name }}
									</h4>
									<p class="text-sm text-gray-600">
										{{ selectedHotel.address }}
									</p>
								</div>
								<button
									@click="clearSelectedHotel"
									class="text-gray-400 hover:text-gray-600"
								>
									<XIcon class="size-5" />
								</button>
							</div>
						</div>

						<!-- Room Search Form -->
						<form @submit.prevent="searchRooms" class="w-full">
							<div class="grid grid-cols-12 gap-4">
								<div class="col-span-12 md:col-span-4">
									<label class="mb-2 block text-sm font-medium text-gray-700">
										Check-in Date
									</label>
									<input
										v-model="roomSearchParams.check_in"
										type="date"
										required
										:min="today"
										class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
									/>
								</div>
								<div class="col-span-12 md:col-span-4">
									<label class="mb-2 block text-sm font-medium text-gray-700">
										Check-out Date
									</label>
									<input
										v-model="roomSearchParams.check_out"
										type="date"
										required
										:min="minCheckoutDate"
										class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
									/>
								</div>
								<div class="col-span-12 md:col-span-4">
									<div class="grid grid-cols-12 gap-4">
										<div class="col-span-8">
											<label
												class="mb-2 block text-sm font-medium text-gray-700"
											>
												Guests & Rooms
											</label>
											<div class="relative">
												<button
													type="button"
													@click="showGuestSelector = !showGuestSelector"
													class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all duration-150 hover:border-gray-300 hover:shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none disabled:bg-gray-100"
												>
													<div class="flex items-center justify-between">
														<div class="flex items-center gap-3">
															<div
																class="flex items-center gap-2 text-gray-900"
															>
																<span class="font-medium">{{
																	roomSearchParams.adults
																}}</span>
																<span class="text-gray-500"
																	>adult{{
																		roomSearchParams.adults > 1 ? "s" : ""
																	}}</span
																>
																<span
																	v-if="roomSearchParams.children > 0"
																	class="text-gray-400"
																	>•</span
																>
																<template v-if="roomSearchParams.children > 0">
																	<span class="font-medium">{{
																		roomSearchParams.children
																	}}</span>
																	<span class="text-gray-500"
																		>child{{
																			roomSearchParams.children > 1 ? "ren" : ""
																		}}</span
																	>
																</template>
																<span class="text-gray-400">•</span>
																<span class="font-medium">{{
																	roomSearchParams.rooms
																}}</span>
																<span class="text-gray-500"
																	>room{{
																		roomSearchParams.rooms > 1 ? "s" : ""
																	}}</span
																>
															</div>
														</div>
														<div class="flex items-center">
															<ChevronDownIcon
																class="h-4 w-4 text-gray-400 transition-transform duration-200"
																:class="{ 'rotate-180': showGuestSelector }"
															/>
														</div>
													</div>
												</button>

												<!-- Guest Selector Dropdown -->
												<div
													v-if="showGuestSelector && selectedHotel"
													class="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
												>
													<div class="p-5">
														<div class="space-y-6">
															<!-- Rooms -->
															<div class="flex items-center justify-between">
																<div>
																	<div class="font-medium text-gray-900">
																		Rooms
																	</div>
																	<div class="mt-0.5 text-sm text-gray-500">
																		Number of rooms needed
																	</div>
																</div>
																<div class="flex items-center gap-3">
																	<button
																		type="button"
																		@click="decrementRooms"
																		:disabled="roomSearchParams.rooms <= 1"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<MinusIcon class="size-3 text-gray-600" />
																	</button>
																	<div class="w-12 text-center">
																		<span class="font-medium text-gray-900">{{
																			roomSearchParams.rooms
																		}}</span>
																	</div>
																	<button
																		type="button"
																		@click="incrementRooms"
																		:disabled="roomSearchParams.rooms >= 8"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<PlusIcon class="size-3 text-gray-600" />
																	</button>
																</div>
															</div>

															<div class="border-t border-gray-100"></div>

															<!-- Adults -->
															<div class="flex items-center justify-between">
																<div>
																	<div class="font-medium text-gray-900">
																		Adults
																	</div>
																	<div class="mt-0.5 text-sm text-gray-500">
																		Ages 18 or above
																	</div>
																</div>
																<div class="flex items-center gap-3">
																	<button
																		type="button"
																		@click="decrementAdults"
																		:disabled="roomSearchParams.adults <= 1"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<MinusIcon class="size-3 text-gray-600" />
																	</button>
																	<div class="w-12 text-center">
																		<span class="font-medium text-gray-900">{{
																			roomSearchParams.adults
																		}}</span>
																	</div>
																	<button
																		type="button"
																		@click="incrementAdults"
																		:disabled="roomSearchParams.adults >= 8"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<PlusIcon class="size-3 text-gray-600" />
																	</button>
																</div>
															</div>

															<div class="border-t border-gray-100"></div>

															<!-- Children -->
															<div class="flex items-center justify-between">
																<div>
																	<div class="font-medium text-gray-900">
																		Children
																	</div>
																	<div class="mt-0.5 text-sm text-gray-500">
																		Ages 8-14
																	</div>
																</div>
																<div class="flex items-center gap-3">
																	<button
																		type="button"
																		@click="decrementChildren"
																		:disabled="roomSearchParams.children <= 0"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<MinusIcon class="size-3 text-gray-600" />
																	</button>
																	<div class="w-12 text-center">
																		<span class="font-medium text-gray-900">{{
																			roomSearchParams.children
																		}}</span>
																	</div>
																	<button
																		type="button"
																		@click="incrementChildren"
																		:disabled="roomSearchParams.children >= 4"
																		class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
																	>
																		<PlusIcon class="size-3 text-gray-600" />
																	</button>
																</div>
															</div>

															<!-- Children Ages -->
															<div
																v-if="roomSearchParams.children > 0"
																class="pt-2"
															>
																<div class="border-t border-gray-100 pt-4">
																	<div class="mb-3">
																		<div
																			class="mb-1 text-sm font-medium text-gray-900"
																		>
																			Child Ages
																		</div>
																		<div class="text-xs text-gray-500">
																			Required for accurate pricing
																		</div>
																	</div>
																	<div class="space-y-2">
																		<div
																			v-for="(childAge, index) in childrenAges"
																			:key="index"
																			class="relative"
																		>
																			<select
																				v-model="childrenAges[index]"
																				@change="updateAgeOfChildrenString"
																				class="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
																			>
																				<option value="" disabled>
																					Child {{ index + 1 }} age
																				</option>
																				<option
																					v-for="age in 7"
																					:key="age + 7"
																					:value="age + 7"
																				>
																					{{ age + 7 }} years old
																				</option>
																			</select>
																			<div
																				class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
																			>
																				<ChevronDownIcon
																					class="size-3 text-gray-600"
																				/>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div class="border-t border-gray-100 px-5 py-3">
														<button
															type="button"
															@click="showGuestSelector = false"
															class="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:ring-1 focus:ring-gray-400 focus:outline-none"
														>
															Done
														</button>
													</div>
												</div>
											</div>
										</div>
										<div class="col-span-4">
											<label
												class="mb-2 block text-sm font-medium text-gray-700"
												>&nbsp;</label
											>
											<CommonButton
												@click="searchRooms"
												:disabled="isRoomSearching || !isRoomFormValid"
												class="w-full"
											>
												<CommonSpinnerLoading
													v-if="isRoomSearching"
													:is-loading="isRoomSearching"
													size="4"
												/>
												<SearchIcon v-else class="size-4 text-white" />
												<span class="ml-2">Search</span>
											</CommonButton>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Room Search Results -->
		<div v-if="roomSearchResults.length > 0" class="mx-auto mt-48 mb-12">
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
		<div class="mx-auto mt-48 grid grid-cols-12 gap-6">
			<div class="col-span-3">
				<div class="sticky top-24">
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
							@book-now="selectHotelForBooking"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue"
import { SpinnerLoading, SkeletonLoading } from "~/components/common"
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
import Button from "~/components/common/Button.vue"

const searchQuery = ref("")
const selectedHotel = ref(null)
const roomSearchResults = ref([])
const roomSearchError = ref("")
const isRoomSearching = ref(false)
const showGuestSelector = ref(false)

// Room search parameters
const roomSearchParams = reactive({
	check_in: "",
	check_out: "",
	rooms: 1,
	adults: 2,
	children: 0,
	age_of_children: "",
})

const childrenAges = ref([])

const filters = ref({
	priceMin: null,
	priceMax: null,
	selectedAmenities: [],
})

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

// Methods
const onHotelSelect = (hotel) => {
	selectedHotel.value = hotel
	searchQuery.value = hotel.hotel_name
	// Clear previous room search results
	roomSearchResults.value = []
	roomSearchError.value = ""
}

const selectHotelForBooking = (hotel) => {
	selectedHotel.value = hotel
	// Scroll to room search form
	window.scrollTo({ top: 0, behavior: "smooth" })
}

const clearSelectedHotel = () => {
	selectedHotel.value = null
	searchQuery.value = ""
	roomSearchResults.value = []
	roomSearchError.value = ""
}

// Room search methods
const incrementRooms = () => {
	if (roomSearchParams.rooms < 8) roomSearchParams.rooms++
}

const decrementRooms = () => {
	if (roomSearchParams.rooms > 1) roomSearchParams.rooms--
}

const incrementAdults = () => {
	if (roomSearchParams.adults < 8) roomSearchParams.adults++
}

const decrementAdults = () => {
	if (roomSearchParams.adults > 1) roomSearchParams.adults--
}

const incrementChildren = () => {
	if (roomSearchParams.children < 4) {
		roomSearchParams.children++
		updateChildrenAges()
	}
}

const decrementChildren = () => {
	if (roomSearchParams.children > 0) {
		roomSearchParams.children--
		updateChildrenAges()
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
}

const searchRooms = async () => {
	if (!selectedHotel.value) return

	showGuestSelector.value = false
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

// Initialize default dates
onMounted(() => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const dayAfter = new Date()
	dayAfter.setDate(dayAfter.getDate() + 2)

	roomSearchParams.check_in = tomorrow.toISOString().split("T")[0]
	roomSearchParams.check_out = dayAfter.toISOString().split("T")[0]
})

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
	},
)
</script>
