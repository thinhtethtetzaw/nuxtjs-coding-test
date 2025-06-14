<template>
	<div class="w-full">
		<!-- Room Search Form -->
		<form @submit.prevent="searchRooms" class="w-full">
			<div class="grid grid-cols-12 gap-4">
				<div class="col-span-12 md:col-span-3">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Check-in Date</label
					>
					<input
						v-model="searchParams.check_in"
						type="date"
						required
						:min="today"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="col-span-12 md:col-span-3">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Check-out Date</label
					>
					<input
						v-model="searchParams.check_out"
						type="date"
						required
						:min="minCheckoutDate"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="col-span-12 md:col-span-4">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>Guests & Rooms</label
					>
					<div class="relative">
						<button
							type="button"
							@click="showGuestSelector = !showGuestSelector"
							class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all duration-150 hover:border-gray-300 hover:shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="flex items-center gap-2 text-gray-900">
										<span class="font-medium">{{ searchParams.adults }}</span>
										<span class="text-gray-500"
											>adult{{ searchParams.adults > 1 ? "s" : "" }}</span
										>
										<span v-if="searchParams.children > 0" class="text-gray-400"
											>•</span
										>
										<template v-if="searchParams.children > 0">
											<span class="font-medium">{{
												searchParams.children
											}}</span>
											<span class="text-gray-500"
												>child{{ searchParams.children > 1 ? "ren" : "" }}</span
											>
										</template>
										<span class="text-gray-400">•</span>
										<span class="font-medium">{{ searchParams.rooms }}</span>
										<span class="text-gray-500"
											>room{{ searchParams.rooms > 1 ? "s" : "" }}</span
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
							v-if="showGuestSelector"
							class="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
						>
							<div class="p-5">
								<div class="space-y-6">
									<!-- Rooms -->
									<div class="flex items-center justify-between">
										<div>
											<div class="font-medium text-gray-900">Rooms</div>
											<div class="mt-0.5 text-sm text-gray-500">
												Number of rooms needed
											</div>
										</div>
										<div class="flex items-center gap-3">
											<button
												type="button"
												@click="decrementRooms"
												:disabled="searchParams.rooms <= 1"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<MinusIcon class="size-3 text-gray-600" />
											</button>
											<div class="w-12 text-center">
												<span class="font-medium text-gray-900">{{
													searchParams.rooms
												}}</span>
											</div>
											<button
												type="button"
												@click="incrementRooms"
												:disabled="searchParams.rooms >= 8"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<PlusIcon class="size-3 text-gray-600" />
											</button>
										</div>
									</div>

									<!-- Divider -->
									<div class="border-t border-gray-100"></div>

									<!-- Adults -->
									<div class="flex items-center justify-between">
										<div>
											<div class="font-medium text-gray-900">Adults</div>
											<div class="mt-0.5 text-sm text-gray-500">
												Ages 18 or above
											</div>
										</div>
										<div class="flex items-center gap-3">
											<button
												type="button"
												@click="decrementAdults"
												:disabled="searchParams.adults <= 1"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<MinusIcon class="size-3 text-gray-600" />
											</button>
											<div class="w-12 text-center">
												<span class="font-medium text-gray-900">{{
													searchParams.adults
												}}</span>
											</div>
											<button
												type="button"
												@click="incrementAdults"
												:disabled="searchParams.adults >= 8"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<PlusIcon class="size-3 text-gray-600" />
											</button>
										</div>
									</div>

									<!-- Divider -->
									<div class="border-t border-gray-100"></div>

									<!-- Children -->
									<div class="flex items-center justify-between">
										<div>
											<div class="font-medium text-gray-900">Children</div>
											<div class="mt-0.5 text-sm text-gray-500">Ages 8-14</div>
										</div>
										<div class="flex items-center gap-3">
											<button
												type="button"
												@click="decrementChildren"
												:disabled="searchParams.children <= 0"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<MinusIcon class="size-3 text-gray-600" />
											</button>
											<div class="w-12 text-center">
												<span class="font-medium text-gray-900">{{
													searchParams.children
												}}</span>
											</div>
											<button
												type="button"
												@click="incrementChildren"
												:disabled="searchParams.children >= 4"
												class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
											>
												<PlusIcon class="size-3 text-gray-600" />
											</button>
										</div>
									</div>

									<!-- Children Ages Section -->
									<div v-if="searchParams.children > 0" class="pt-2">
										<div class="border-t border-gray-100 pt-4">
											<div class="mb-3">
												<div class="mb-1 text-sm font-medium text-gray-900">
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
														<ChevronDownIcon class="size-3 text-gray-600" />
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
				<div class="col-span-12 md:col-span-2">
					<label class="mb-2 block text-sm font-medium text-gray-700"
						>&nbsp;</label
					>
					<CommonButton
						@click="searchRooms"
						:disabled="isSearching || !isFormValid"
						class="w-full"
					>
						<CommonSpinnerLoading
							v-if="isSearching"
							:is-loading="isSearching"
							size="4"
						/>
						<SearchIcon v-else class="size-5 text-white" />
						<span class="ml-2">Search</span>
					</CommonButton>
				</div>
			</div>
		</form>

		<!-- Loading -->
		<div v-if="isSearching" class="flex items-center justify-center py-6">
			<div class="text-center">
				<CommonSpinnerLoading :is-loading="isSearching" />
				<p class="mt-2 text-sm text-gray-600">Searching rooms...</p>
			</div>
		</div>

		<!-- Error -->
		<div
			v-else-if="searchError"
			class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center"
		>
			<div class="mb-3 flex items-center justify-center gap-2 text-red-600">
				<AlertTriangleIcon class="size-5 text-red-600" />
				<p class="text-sm font-medium">{{ searchError }}</p>
			</div>
			<button
				@click="searchRooms"
				class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
			>
				Try Again
			</button>
		</div>
	</div>
</template>

<script setup>
import {
	AlertTriangleIcon,
	ChevronDownIcon,
	MinusIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-vue-next"

const emit = defineEmits(["search", "error"])

// Reactive data
const searchParams = reactive({
	check_in: "",
	check_out: "",
	rooms: 1,
	adults: 2,
	children: 0,
	age_of_children: "",
})

const childrenAges = ref([])
const showGuestSelector = ref(false)
const isSearching = ref(false)
const searchError = ref("")

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
	// Check if all children have selected ages
	const allChildrenHaveAges =
		searchParams.children === 0 ||
		(childrenAges.value.length === searchParams.children &&
			childrenAges.value.every((age) => age !== ""))

	return (
		searchParams.check_in &&
		searchParams.check_out &&
		searchParams.check_in !== searchParams.check_out &&
		new Date(searchParams.check_in) < new Date(searchParams.check_out) &&
		allChildrenHaveAges
	)
})

// Methods for counter controls
const incrementRooms = () => {
	if (searchParams.rooms < 8) searchParams.rooms++
}

const decrementRooms = () => {
	if (searchParams.rooms > 1) searchParams.rooms--
}

const incrementAdults = () => {
	if (searchParams.adults < 8) searchParams.adults++
}

const decrementAdults = () => {
	if (searchParams.adults > 1) searchParams.adults--
}

const incrementChildren = () => {
	if (searchParams.children < 4) {
		searchParams.children++
		updateChildrenAges()
	}
}

const decrementChildren = () => {
	if (searchParams.children > 0) {
		searchParams.children--
		updateChildrenAges()
	}
}

const updateChildrenAges = () => {
	const childrenCount = parseInt(searchParams.children)
	if (childrenCount === 0) {
		childrenAges.value = []
		searchParams.age_of_children = ""
	} else {
		// Resize array to match children count
		childrenAges.value = Array(childrenCount)
			.fill("")
			.map((_, index) => childrenAges.value[index] || "")
	}
	updateAgeOfChildrenString()
}

const updateAgeOfChildrenString = () => {
	if (searchParams.children === 0) {
		searchParams.age_of_children = ""
	} else {
		const validAges = childrenAges.value.filter((age) => age !== "")
		searchParams.age_of_children = validAges.join(",")
	}
}

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
	// Close guest selector
	showGuestSelector.value = false

	// Validate children ages
	const childrenValidation = validateChildrenAges(searchParams.age_of_children)
	if (!childrenValidation.valid) {
		searchError.value = childrenValidation.error
		emit("error", childrenValidation.error)
		return
	}

	isSearching.value = true
	searchError.value = ""

	try {
		const searchData = {
			check_in: searchParams.check_in,
			check_out: searchParams.check_out,
			rooms: searchParams.rooms.toString(),
			adults: searchParams.adults.toString(),
			age_of_children: searchParams.age_of_children || undefined,
		}

		// Emit search event with search parameters
		emit("search", searchData)
	} catch (error) {
		console.error("Room search error:", error)
		const errorMessage =
			error.data?.message || "Failed to search rooms. Please try again."
		searchError.value = errorMessage
		emit("error", errorMessage)
	} finally {
		isSearching.value = false
	}
}

// Close guest selector when clicking outside
const handleClickOutside = (event) => {
	if (!event.target.closest(".relative")) {
		showGuestSelector.value = false
	}
}

// Set default dates
onMounted(() => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const dayAfter = new Date()
	dayAfter.setDate(dayAfter.getDate() + 2)

	searchParams.check_in = tomorrow.toISOString().split("T")[0]
	searchParams.check_out = dayAfter.toISOString().split("T")[0]

	// Add click outside listener
	document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside)
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

// Expose search parameters for parent component access
defineExpose({
	searchParams,
	isSearching,
	searchError,
})
</script>
