<template>
	<div class="min-h-screen">
		<!-- Loading -->
		<div v-if="isSearching" class="flex items-center justify-center py-12">
			<div class="text-center">
				<CommonSpinnerLoading :is-loading="isSearching" />
				<p class="mt-4 text-sm text-gray-600">Searching rooms...</p>
			</div>
		</div>

		<!-- Error -->
		<div
			v-else-if="searchError"
			class="mt-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
		>
			<div class="mb-3 flex items-center justify-center gap-2 text-red-600">
				<AlertTriangleIcon class="size-5 text-red-600" />
				<p class="text-sm font-medium">{{ searchError }}</p>
			</div>
			<button
				@click="retrySearch"
				class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
			>
				Try Again
			</button>
		</div>

		<!-- No rooms found -->
		<div
			v-else-if="displayRooms.length === 0 && hasSearched"
			class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
		>
			<div
				class="mb-3 flex flex-col items-center justify-center gap-2 text-gray-500"
			>
				<div
					class="flex items-center justify-center gap-2 rounded-full bg-gray-200 p-2"
				>
					<SearchIcon class="size-5 text-gray-500" />
				</div>
				<p class="text-sm font-medium">No rooms available</p>
				<p class="text-xs text-gray-400">Try adjusting your search criteria</p>
			</div>
		</div>

		<div v-else class="mt-4 space-y-4">
			<div
				v-for="(room, index) in displayRooms"
				:key="room.id"
				class="overflow-hidden rounded-lg border border-gray-200 bg-white"
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
							<CommonButton
								variant="ghost"
								class="text-primary mt-6 !px-0 font-medium hover:text-blue-400"
							>
								View all amenities
							</CommonButton>
						</div>
						<div class="w-full space-y-3 lg:w-96">
							<div
								v-for="(ratePlan, planIndex) in room.rate_plans?.slice(0, 2)"
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
												{{ hotelData.currency_code }}
												{{
													Math.round(ratePlan.pivot?.price * 1.15) ||
													Math.round(hotelData.avg_price * 1.15)
												}}
											</span>
											<span class="text-xl font-semibold text-gray-900">
												{{ hotelData.currency_code }}
												{{ ratePlan.pivot?.price || hotelData.avg_price }}
											</span>
										</div>
										<p class="text-xs text-gray-500">
											per night for {{ currentSearchParams?.rooms || 1 }} room{{
												(currentSearchParams?.rooms || 1) > 1 ? "s" : ""
											}}
										</p>
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
								<div
									v-if="ratePlan.cancel_penalty_description"
									class="mb-3 text-xs text-blue-600 hover:text-blue-700"
								>
									<a href="#" class="underline">
										{{
											ratePlan.cancel_penalty_description.substring(0, 50)
										}}...
									</a>
								</div>
								<button
									@click="selectRoom(room, ratePlan)"
									:class="[
										selectedRooms.some(
											(s) =>
												s.roomId === room.id && s.ratePlanId === ratePlan.id,
										)
											? 'bg-green-600 text-white hover:bg-green-700'
											: 'bg-primary hover:bg-primary/80 text-white',
										'w-full rounded-md px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none',
										selectedRooms.some(
											(s) =>
												s.roomId === room.id && s.ratePlanId === ratePlan.id,
										)
											? 'focus:ring-green-500'
											: 'focus:ring-blue-500',
									]"
								>
									{{
										selectedRooms.some(
											(s) =>
												s.roomId === room.id && s.ratePlanId === ratePlan.id,
										)
											? "✔ Added"
											: `Add ${currentSearchParams?.rooms || 1} Room${(currentSearchParams?.rooms || 1) > 1 ? "s" : ""}`
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
				class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
			>
				<div class="w-full max-w-md rounded-lg bg-white shadow-xl">
					<div class="p-6">
						<div class="mb-4 flex items-center gap-3">
							<div class="rounded-full bg-red-100 p-2">
								<AlertTriangleIcon class="size-4 text-red-600" />
							</div>
							<h3 class="text-lg font-semibold text-gray-900">
								Room Capacity Exceeded
							</h3>
						</div>
						<p class="mb-4 text-gray-700">{{ capacityMessage }}</p>
						<div
							class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
						>
							<p class="text-sm text-yellow-800">
								<strong>Current Selection:</strong>
								{{ totalGuests }} guests<br />
								<strong>Room Capacity:</strong>
								{{ selectedRoomCapacity }} guests maximum
							</p>
						</div>
						<div class="flex gap-3">
							<button
								@click="showNewSearch"
								class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							>
								Search New Rooms
							</button>
							<button
								@click="closeCapacityModal"
								class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import {
	AlertTriangleIcon,
	SearchIcon,
	UsersIcon,
	RulerIcon,
	CheckIcon,
} from "lucide-vue-next"

const props = defineProps({ hotelData: Object })
const route = useRoute()

// Reactive data
const isSearching = ref(false)
const hasSearched = ref(false)
const searchError = ref("")
const searchResults = ref([])
const selectedRooms = ref([])
const showCapacityModal = ref(false)
const capacityMessage = ref("")
const selectedRoomCapacity = ref(0)
const totalGuests = ref(0)
const currentSearchParams = ref(null)

const roomPayload = {
	hotel: route.params.slug,
	rooms: currentSearchParams.value?.rooms || 1,
	adults: currentSearchParams.value?.adults || 2,
	age_of_children: currentSearchParams.value?.age_of_children || "",
}

// Computed properties
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

const handleRoomSearch = async (searchData) => {
	currentSearchParams.value = searchData
	isSearching.value = true
	searchError.value = ""

	try {
		const response = await $fetch(`/api/hotels/${route.params.slug}/rooms`, {
			method: "POST",
			body: searchData,
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

const handleSearchError = (error) => {
	searchError.value = error
}

const retrySearch = () => {
	if (currentSearchParams.value) {
		handleRoomSearch(currentSearchParams.value)
	}
}

const clearSearch = () => {
	hasSearched.value = false
	searchResults.value = []
	searchError.value = ""
	selectedRooms.value = []
	currentSearchParams.value = null
}

const calculateTotalGuests = () => {
	if (!currentSearchParams.value) return 2 // default

	let total = parseInt(currentSearchParams.value.adults || 2)
	if (currentSearchParams.value.age_of_children) {
		const childrenValidation = validateChildrenAges(
			currentSearchParams.value.age_of_children,
		)
		if (childrenValidation.valid) {
			total += childrenValidation.ages.length
		}
	}
	return total
}

const selectRoom = (room, ratePlan) => {
	const totalGuestsCount = calculateTotalGuests()
	const roomCapacity =
		room.max_occupancy * parseInt(currentSearchParams.value?.rooms || 1)

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
</script>
