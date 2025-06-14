<template>
	<div>
		<!-- Room Search Form -->
		<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Search Rooms</h3>
			<form @submit.prevent="searchRooms" class="grid grid-cols-12 gap-4">
				<div class="col-span-3">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Check-in Date</label
					>
					<input
						v-model="searchParams.check_in"
						type="date"
						required
						:min="today"
						class="w-full rounded border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
					/>
				</div>
				<div class="col-span-3">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Check-out Date</label
					>
					<input
						v-model="searchParams.check_out"
						type="date"
						required
						:min="minCheckoutDate"
						class="w-full rounded border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
					/>
				</div>
				<div class="col-span-2">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Rooms</label
					>
					<select
						v-model="searchParams.rooms"
						class="w-full rounded border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
					>
						<option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
					</select>
				</div>
				<div class="col-span-2">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Adults</label
					>
					<select
						v-model="searchParams.adults"
						class="w-full rounded border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
					>
						<option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
					</select>
				</div>
				<div class="col-span-2">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Children Ages (optional)</label
					>
					<input
						v-model="searchParams.age_of_children"
						type="text"
						placeholder="e.g., 8,10"
						maxlength="20"
						class="w-full rounded border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
					/>
					<p class="mt-1 text-xs text-gray-500">Ages 8-14, max 4 children</p>
				</div>
			</form>
			<div class="mt-4 flex gap-3">
				<button
					@click="searchRooms"
					:disabled="isSearching || !isFormValid"
					class="flex items-center gap-2 rounded bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:bg-gray-400"
				>
					<span v-if="isSearching" class="animate-spin">⏳</span>
					{{ isSearching ? "Searching..." : "Search Rooms" }}
				</button>
				<button
					v-if="hasSearched"
					@click="clearSearch"
					class="rounded bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300"
				>
					Clear Search
				</button>
			</div>
		</div>

		<!-- Room Results -->
		<div v-if="isSearching" class="flex items-center justify-center py-10">
			<div
				class="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"
			></div>
		</div>

		<div
			v-else-if="searchError"
			class="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
		>
			<p class="text-red-700">{{ searchError }}</p>
			<button
				@click="searchRooms"
				class="mt-3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
			>
				Try Again
			</button>
		</div>

		<div
			v-else-if="displayRooms.length === 0 && hasSearched"
			class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
		>
			<p class="text-gray-600">
				No rooms available for your selected dates and criteria.
			</p>
			<p class="mt-2 text-sm text-gray-500">
				Try adjusting your search parameters.
			</p>
		</div>

		<div v-else>
			<h3 class="mb-4 text-lg font-semibold text-gray-900">
				{{
					displayRooms === hotelData.rooms
						? "Available Rooms"
						: "Search Results"
				}}
			</h3>
			<div
				v-for="(room, index) in displayRooms"
				:key="room.id"
				class="mb-6 rounded-lg border border-gray-200"
			>
				<div class="p-6">
					<div class="flex gap-6">
						<div class="h-32 w-48 flex-shrink-0">
							<img
								:src="room.gallery?.[0]?.url || '/placeholder-room.jpg'"
								:alt="room.room_type"
								class="h-full w-full rounded-lg object-cover"
							/>
						</div>
						<div class="flex-1">
							<h4 class="mb-2 text-lg font-semibold text-gray-900">
								{{ room.room_type }}
							</h4>
							<div class="mb-4 space-y-2">
								<div class="flex items-center gap-2 text-gray-600">
									✓ <span>Max {{ room.max_occupancy }} guests</span>
								</div>
								<div class="flex items-center gap-2 text-gray-600">
									✓ <span>{{ room.size_measurement || "Spacious room" }}</span>
								</div>
								<div
									v-for="amenity in room.amenities?.slice(0, 2)"
									:key="amenity.id"
									class="flex items-center gap-2 text-gray-600"
								>
									✓ <span>{{ amenity.amenity_name }}</span>
								</div>
							</div>
							<button class="font-medium text-orange-500 hover:text-orange-600">
								View all Amenities
							</button>
						</div>
						<div class="w-80 space-y-4">
							<div
								v-for="(ratePlan, planIndex) in room.rate_plans?.slice(0, 2)"
								:key="ratePlan.id"
								class="rounded-lg border border-gray-200 p-4"
							>
								<div class="mb-2 flex items-start justify-between">
									<span class="font-medium">{{ ratePlan.rate_plan_name }}</span>
									<div class="text-right">
										<div class="flex items-center gap-2">
											<span class="text-gray-400 line-through"
												>{{ hotelData.currency_code }}
												{{
													Math.round(ratePlan.pivot?.price * 1.15) ||
													Math.round(hotelData.avg_price * 1.15)
												}}</span
											>
											<span class="font-bold"
												>{{ hotelData.currency_code }}
												{{ ratePlan.pivot?.price || hotelData.avg_price }}</span
											>
										</div>
										<p class="text-xs text-gray-500">
											per night for {{ searchParams.rooms }} Room{{
												searchParams.rooms > 1 ? "s" : ""
											}}
										</p>
									</div>
								</div>
								<div class="mb-2 text-gray-600">
									Inclusions<br />
									<div
										v-if="ratePlan.include_breakfast"
										class="flex items-center gap-1 text-xs"
									>
										✓ <span>Free Breakfast</span>
									</div>
									<div
										v-for="benefit in ratePlan.benefits?.slice(0, 2)"
										:key="benefit.id"
										class="flex items-center gap-1 text-xs"
									>
										✓ <span>{{ benefit.hint }}</span>
									</div>
									<div
										v-if="!ratePlan.no_cancel_ind"
										class="flex items-center gap-1 text-xs"
									>
										✓ <span>Free Cancellation</span>
									</div>
								</div>
								<div
									v-if="ratePlan.cancel_penalty_description"
									class="mb-3 text-xs text-gray-600"
								>
									<a href="#" class="text-orange-500"
										>{{
											ratePlan.cancel_penalty_description.substring(0, 50)
										}}...</a
									>
								</div>
								<button
									@click="selectRoom(room, ratePlan)"
									:class="[
										selectedRooms.some(
											(s) =>
												s.roomId === room.id && s.ratePlanId === ratePlan.id,
										)
											? 'bg-orange-500 text-white hover:bg-orange-600'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
										'w-full rounded py-2 font-medium',
									]"
								>
									{{
										selectedRooms.some(
											(s) =>
												s.roomId === room.id && s.ratePlanId === ratePlan.id,
										)
											? "✓ Added"
											: `Add ${searchParams.rooms} Room${searchParams.rooms > 1 ? "s" : ""}`
									}}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Capacity Validation Modal -->
		<Transition
			name="modal"
			enter-active-class="transition-all duration-300 ease-out"
			leave-active-class="transition-all duration-200 ease-in"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="showCapacityModal"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			>
				<div class="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
					<div class="mb-4 flex items-center gap-3">
						<div class="rounded-full bg-red-100 p-2">
							<svg
								class="h-6 w-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-semibold text-gray-900">
							Room Capacity Exceeded
						</h3>
					</div>
					<div class="mb-6">
						<p class="text-gray-700">{{ capacityMessage }}</p>
						<div class="mt-3 rounded-lg bg-yellow-50 p-3">
							<p class="text-sm text-yellow-800">
								<strong>Current Selection:</strong>
								{{ totalGuests }} guests<br />
								<strong>Room Capacity:</strong>
								{{ selectedRoomCapacity }} guests maximum
							</p>
						</div>
					</div>
					<div class="flex gap-3">
						<button
							@click="showNewSearch"
							class="flex-1 rounded bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
						>
							Search New Rooms
						</button>
						<button
							@click="closeCapacityModal"
							class="flex-1 rounded bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
const props = defineProps({ hotelData: Object })
const route = useRoute()

// Reactive data
const searchParams = reactive({
	check_in: "",
	check_out: "",
	rooms: 1,
	adults: 2,
	age_of_children: "",
})

const isSearching = ref(false)
const hasSearched = ref(false)
const searchError = ref("")
const searchResults = ref([])
const selectedRooms = ref([])
const showCapacityModal = ref(false)
const capacityMessage = ref("")
const selectedRoomCapacity = ref(0)
const totalGuests = ref(0)

// Computed properties
const today = computed(() => {
	return new Date().toISOString().split("T")[0]
})

const minCheckoutDate = computed(() => {
	if (!searchParams.check_in) return today.value
	const checkIn = new Date(searchParams.check_in)
	checkIn.setDate(checkIn.getDate() + 1)
	return checkIn.toISOString().split("T")[0]
})

const isFormValid = computed(() => {
	return (
		searchParams.check_in &&
		searchParams.check_out &&
		searchParams.check_in !== searchParams.check_out &&
		new Date(searchParams.check_in) < new Date(searchParams.check_out)
	)
})

const displayRooms = computed(() => {
	return hasSearched.value && searchResults.value.length > 0
		? searchResults.value
		: props.hotelData.rooms || []
})

// Methods
const validateChildrenAges = (ageString) => {
	if (!ageString) return { valid: true, ages: [] }

	const ages = ageString
		.split(",")
		.map((age) => parseInt(age.trim()))
		.filter((age) => !isNaN(age))

	if (ages.length > 4) {
		return { valid: false, error: "Maximum 4 children allowed" }
	}

	if (ages.some((age) => age < 8 || age > 14)) {
		return { valid: false, error: "Children ages must be between 8 and 14" }
	}

	return { valid: true, ages }
}

const searchRooms = async () => {
	// Validate children ages
	const childrenValidation = validateChildrenAges(searchParams.age_of_children)
	if (!childrenValidation.valid) {
		searchError.value = childrenValidation.error
		return
	}

	isSearching.value = true
	searchError.value = ""

	try {
		const payload = {
			check_in: searchParams.check_in,
			check_out: searchParams.check_out,
			rooms: searchParams.rooms.toString(),
			adults: searchParams.adults.toString(),
			age_of_children: searchParams.age_of_children || undefined,
		}

		const response = await $fetch(`/api/hotels/${route.params.slug}/rooms`, {
			method: "POST",
			body: payload,
		})

		if (response.data && response.data.rooms) {
			searchResults.value = response.data.rooms
			hasSearched.value = true
		} else {
			searchResults.value = []
			hasSearched.value = true
		}
	} catch (error) {
		console.error("Room search error:", error)
		searchError.value =
			error.data?.message || "Failed to search rooms. Please try again."
	} finally {
		isSearching.value = false
	}
}

const clearSearch = () => {
	hasSearched.value = false
	searchResults.value = []
	searchError.value = ""
	selectedRooms.value = []
}

const calculateTotalGuests = () => {
	let total = parseInt(searchParams.adults)
	if (searchParams.age_of_children) {
		const childrenValidation = validateChildrenAges(
			searchParams.age_of_children,
		)
		if (childrenValidation.valid) {
			total += childrenValidation.ages.length
		}
	}
	return total
}

const selectRoom = (room, ratePlan) => {
	const totalGuestsCount = calculateTotalGuests()
	const roomCapacity = room.max_occupancy * parseInt(searchParams.rooms)

	// Check capacity
	if (totalGuestsCount > roomCapacity) {
		totalGuests.value = totalGuestsCount
		selectedRoomCapacity.value = roomCapacity
		capacityMessage.value = `You've selected ${totalGuestsCount} guests, but the selected room(s) can accommodate a maximum of ${roomCapacity} guests. Please adjust your search criteria or choose a different room type.`
		showCapacityModal.value = true
		return
	}

	const roomSelection = {
		roomId: room.id,
		ratePlanId: ratePlan.id,
		roomType: room.room_type,
		ratePlanName: ratePlan.rate_plan_name,
		price: ratePlan.pivot?.price || props.hotelData.avg_price,
	}

	const existingIndex = selectedRooms.value.findIndex(
		(s) => s.roomId === room.id && s.ratePlanId === ratePlan.id,
	)

	if (existingIndex > -1) {
		selectedRooms.value.splice(existingIndex, 1)
	} else {
		selectedRooms.value.push(roomSelection)
	}
}

const closeCapacityModal = () => {
	showCapacityModal.value = false
}

const showNewSearch = () => {
	showCapacityModal.value = false
	// Scroll to search form
	window.scrollTo({ top: 0, behavior: "smooth" })
}

// Set default dates
onMounted(() => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const dayAfter = new Date()
	dayAfter.setDate(dayAfter.getDate() + 2)

	searchParams.check_in = tomorrow.toISOString().split("T")[0]
	searchParams.check_out = dayAfter.toISOString().split("T")[0]
})

// Watch for check-in date changes to update minimum check-out
watch(
	() => searchParams.check_in,
	(newCheckIn) => {
		if (
			newCheckIn &&
			searchParams.check_out &&
			new Date(newCheckIn) >= new Date(searchParams.check_out)
		) {
			const checkIn = new Date(newCheckIn)
			checkIn.setDate(checkIn.getDate() + 1)
			searchParams.check_out = checkIn.toISOString().split("T")[0]
		}
	},
)
</script>
