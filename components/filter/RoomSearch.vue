<template>
	<form @submit.prevent="onSearch" class="w-full">
		<!-- Compact Layout for Sticky Header -->
		<div v-if="isCompact" class="flex items-center gap-3">
			<!-- Check-in Date -->
			<div class="w-36 flex-shrink-0">
				<input
					v-model="searchParams.check_in"
					type="date"
					required
					:min="today"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<!-- Check-out Date -->
			<div class="w-36 flex-shrink-0">
				<input
					v-model="searchParams.check_out"
					type="date"
					required
					:min="minCheckoutDate"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<!-- Guests & Rooms Compact -->
			<div class="relative w-52 flex-shrink-0">
				<button
					type="button"
					@click="showGuestSelector = !showGuestSelector"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all duration-150 hover:border-gray-300 hover:shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
				>
					<div class="flex items-center justify-between">
						<span class="truncate text-sm text-gray-900">
							{{ searchParams.adults }} Adult{{
								searchParams.adults > 1 ? "s" : ""
							}}
							{{
								searchParams.children > 0
									? `• ${searchParams.children} Child${
											searchParams.children > 1 ? "ren" : ""
										}`
									: ""
							}}
							• {{ searchParams.rooms }}
							{{ searchParams.rooms > 1 ? "rooms" : "room" }}
						</span>
						<ChevronDownIcon class="ml-1 h-4 w-4 flex-shrink-0 text-gray-400" />
					</div>
				</button>

				<!-- Compact Guest Selector Dropdown -->
				<div
					v-if="showGuestSelector"
					class="absolute top-full right-0 z-10 mt-1 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
				>
					<div class="space-y-4 pb-4">
						<!-- Rooms -->
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-900"
								>Room{{ searchParams.rooms > 1 ? "s" : "" }}</span
							>
							<div class="flex items-center gap-2">
								<button
									type="button"
									@click="decrementRooms"
									:disabled="searchParams.rooms <= 1"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<MinusIcon class="size-3" />
								</button>
								<span class="w-8 text-center text-sm">{{
									searchParams.rooms
								}}</span>
								<button
									type="button"
									@click="incrementRooms"
									:disabled="searchParams.rooms >= 8"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<PlusIcon class="size-3" />
								</button>
							</div>
						</div>

						<!-- Adults -->
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-900"
								>Adult{{ searchParams.adults > 1 ? "s" : "" }}</span
							>
							<div class="flex items-center gap-2">
								<button
									type="button"
									@click="decrementAdults"
									:disabled="searchParams.adults <= 1"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<MinusIcon class="size-3" />
								</button>
								<span class="w-8 text-center text-sm">{{
									searchParams.adults
								}}</span>
								<button
									type="button"
									@click="incrementAdults"
									:disabled="searchParams.adults >= 8"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<PlusIcon class="size-3" />
								</button>
							</div>
						</div>

						<!-- Children -->
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-900"
								>Child{{ searchParams.children > 1 ? "ren" : "" }}</span
							>
							<div class="flex items-center gap-2">
								<button
									type="button"
									@click="decrementChildren"
									:disabled="searchParams.children <= 0"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<MinusIcon class="size-3" />
								</button>
								<span class="w-8 text-center text-sm">{{
									searchParams.children
								}}</span>
								<button
									type="button"
									@click="incrementChildren"
									:disabled="searchParams.children >= 4"
									class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
								>
									<PlusIcon class="size-3" />
								</button>
							</div>
						</div>

						<!-- Children Ages -->
						<div v-if="searchParams.children > 0">
							<div class="mb-3">
								<span class="text-sm font-medium text-gray-900"
									>Child Ages</span
								>
								<p class="mt-1 text-xs text-gray-500">
									Required for accurate pricing
								</p>
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
										class="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									>
										<option value="" disabled class="text-gray-400">
											Child {{ index + 1 }} age
										</option>
										<option
											v-for="age in 7"
											:key="age + 7"
											:value="age + 7"
											class="text-gray-900"
										>
											{{ age + 7 }} years old
										</option>
									</select>
									<div
										class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
									>
										<ChevronDownIcon class="h-4 w-4 text-gray-400" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<CommonButton
						type="button"
						@click="onGuestSelectorDone"
						class="w-full !bg-gray-800"
					>
						Done
					</CommonButton>
				</div>
			</div>

			<!-- Search Button -->
			<CommonButton
				@click="onSearch"
				:disabled="isSearching || !isFormValid"
				class="px-6"
			>
				<CommonSpinnerLoading
					v-if="isSearching"
					:is-loading="isSearching"
					size="4"
				/>
				<SearchIcon v-else class="size-4 text-white" />
				<span class="ml-2">Search</span>
			</CommonButton>
		</div>

		<!-- Full Layout for Banner -->
		<div v-else class="grid grid-cols-12 gap-4">
			<div class="col-span-12 md:col-span-3">
				<label class="mb-2 block text-sm font-medium text-gray-700">
					Check-in Date
				</label>
				<input
					v-model="searchParams.check_in"
					type="date"
					required
					:min="today"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
				/>
			</div>
			<div class="col-span-12 md:col-span-3">
				<label class="mb-2 block text-sm font-medium text-gray-700">
					Check-out Date
				</label>
				<input
					v-model="searchParams.check_out"
					type="date"
					required
					:min="minCheckoutDate"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
				/>
			</div>
			<div class="col-span-12 md:col-span-6">
				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-8">
						<label class="mb-2 block text-sm font-medium text-gray-700">
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
										<div class="flex items-center gap-2 text-gray-900">
											<span class="font-medium">{{ searchParams.adults }}</span>
											<span class="text-gray-500"
												>adult{{ searchParams.adults > 1 ? "s" : "" }}</span
											>
											<span
												v-if="searchParams.children > 0"
												class="text-gray-400"
												>•</span
											>
											<template v-if="searchParams.children > 0">
												<span class="font-medium">{{
													searchParams.children
												}}</span>
												<span class="text-gray-500"
													>child{{
														searchParams.children > 1 ? "ren" : ""
													}}</span
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
								class="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
							>
								<div class="space-y-4 divide-y divide-gray-100">
									<!-- Rooms -->
									<div class="space-y-2 py-2">
										<p class="text-sm text-gray-500">Number of room needed</p>
										<div class="flex items-center justify-between">
											<p class="font-medium text-gray-700">Room</p>
											<div class="flex items-center gap-3">
												<button
													type="button"
													@click="decrementRooms"
													:disabled="searchParams.rooms <= 1"
													class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
												>
													<MinusIcon class="size-3 text-gray-600" />
												</button>
												<div class="w-8 text-center">
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
									</div>

									<!-- Adults -->
									<div class="space-y-2 py-2">
										<p class="text-sm text-gray-500">Ages 18 or above</p>
										<div class="flex items-center justify-between">
											<p class="font-medium text-gray-700">Adults</p>
											<div class="flex items-center gap-3">
												<button
													type="button"
													@click="decrementAdults"
													:disabled="searchParams.adults <= 1"
													class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
												>
													<MinusIcon class="size-3 text-gray-600" />
												</button>
												<div class="w-8 text-center">
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
									</div>

									<!-- Children -->
									<div class="space-y-2 py-2">
										<p class="text-sm text-gray-500">Ages 8-14</p>
										<div class="flex items-center justify-between">
											<p class="font-medium text-gray-700">Children</p>
											<div class="flex items-center gap-3">
												<button
													type="button"
													@click="decrementChildren"
													:disabled="searchParams.children <= 0"
													class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
												>
													<MinusIcon class="size-3 text-gray-600" />
												</button>
												<div class="w-8 text-center">
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
									</div>

									<!-- Children Ages -->
									<div v-if="searchParams.children > 0">
										<div class="mb-3">
											<span class="text-sm font-medium text-gray-900"
												>Child Ages</span
											>
											<p class="mt-1 text-xs text-gray-500">
												Required for accurate pricing
											</p>
										</div>
										<div class="space-y-2 pb-4">
											<div
												v-for="(childAge, index) in childrenAges"
												:key="index"
												class="relative"
											>
												<select
													v-model="childrenAges[index]"
													@change="updateAgeOfChildrenString"
													class="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												>
													<option value="" disabled class="text-gray-400">
														Child {{ index + 1 }} age
													</option>
													<option
														v-for="age in 7"
														:key="age + 7"
														:value="age + 7"
														class="text-gray-900"
													>
														{{ age + 7 }} years old
													</option>
												</select>
												<div
													class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
												>
													<ChevronDownIcon class="h-4 w-4 text-gray-400" />
												</div>
											</div>
										</div>
									</div>
								</div>

								<CommonButton
									type="button"
									@click="onGuestSelectorDone"
									class="w-full !bg-gray-800"
								>
									Done
								</CommonButton>
							</div>
						</div>
					</div>
					<div class="col-span-4">
						<label class="mb-2 block text-sm font-medium text-gray-700"
							>&nbsp;</label
						>
						<CommonButton
							@click="onSearch"
							:disabled="isSearching || !isFormValid"
							class="w-full"
						>
							<CommonSpinnerLoading
								v-if="isSearching"
								:is-loading="isSearching"
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
</template>

<script setup>
import {
	ChevronDownIcon,
	MinusIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-vue-next"
import { useRouter, useRoute } from "vue-router"

const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
	},
	isSearching: {
		type: Boolean,
		default: false,
	},
	isCompact: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["update:modelValue", "search"])

const searchParams = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
})

const showGuestSelector = ref(false)
const childrenAges = ref([])
const router = useRouter()
const route = useRoute()

// Computed properties
const today = computed(() => {
	return new Date().toISOString().split("T")[0]
})

const minCheckoutDate = computed(() => {
	if (!searchParams.value.check_in) return today.value
	const checkIn = new Date(searchParams.value.check_in)
	checkIn.setDate(checkIn.getDate() + 1)
	return checkIn.toISOString().split("T")[0]
})

const isFormValid = computed(() => {
	const allChildrenHaveAges =
		searchParams.value.children === 0 ||
		(childrenAges.value.length === searchParams.value.children &&
			childrenAges.value.every((age) => age !== ""))

	return (
		searchParams.value.check_in &&
		searchParams.value.check_out &&
		searchParams.value.check_in !== searchParams.value.check_out &&
		new Date(searchParams.value.check_in) <
			new Date(searchParams.value.check_out) &&
		allChildrenHaveAges
	)
})

// Methods
const onSearch = () => {
	emit("search")
}

const incrementRooms = () => {
	if (searchParams.value.rooms < 8) {
		searchParams.value.rooms++
	}
}

const decrementRooms = () => {
	if (searchParams.value.rooms > 1) {
		searchParams.value.rooms--
	}
}

const incrementAdults = () => {
	if (searchParams.value.adults < 8) {
		searchParams.value.adults++
	}
}

const decrementAdults = () => {
	if (searchParams.value.adults > 1) {
		searchParams.value.adults--
	}
}

const incrementChildren = () => {
	if (searchParams.value.children < 4) {
		searchParams.value.children++
		updateChildrenAges()
	}
}

const decrementChildren = () => {
	if (searchParams.value.children > 0) {
		searchParams.value.children--
		updateChildrenAges()
	}
}

const updateChildrenAges = () => {
	const childrenCount = parseInt(searchParams.value.children)
	if (childrenCount === 0) {
		childrenAges.value = []
		searchParams.value.age_of_children = ""
	} else {
		childrenAges.value = Array(childrenCount)
			.fill("")
			.map((_, index) => childrenAges.value[index] || "")
	}
	updateAgeOfChildrenString()
}

const updateAgeOfChildrenString = () => {
	if (searchParams.value.children === 0) {
		searchParams.value.age_of_children = ""
	} else {
		const validAges = childrenAges.value.filter((age) => age !== "")
		searchParams.value.age_of_children = validAges.join(",")
	}
}

const updateUrlParams = () => {
	router.replace({
		query: {
			...route.query,
			rooms: searchParams.value.rooms,
			adults: searchParams.value.adults,
			age_of_children: searchParams.value.age_of_children || undefined,
		},
	})
}

const onGuestSelectorDone = () => {
	showGuestSelector.value = false
	updateUrlParams()
}

// Initialize children ages when component is mounted
onMounted(() => {
	updateChildrenAges()
})

// Watch for changes in search params to update children ages
watch(
	() => searchParams.value.children,
	(newChildren) => {
		updateChildrenAges()
	},
)

// Watch for changes in age_of_children string to update children ages array
watch(
	() => searchParams.value.age_of_children,
	(newAgeString) => {
		if (newAgeString && newAgeString.length > 0) {
			const ages = newAgeString
				.split(",")
				.map((age) => age.trim())
				.filter(Boolean)
			// Update children count based on age_of_children string
			searchParams.value.children = ages.length
			childrenAges.value = Array(ages.length)
				.fill("")
				.map((_, index) => ages[index] || "")
		} else {
			searchParams.value.children = 0
			childrenAges.value = []
		}
	},
	{ immediate: true },
)

// Watch for check-in date changes
watch(
	() => searchParams.value.check_in,
	(newCheckIn) => {
		if (
			newCheckIn &&
			searchParams.value.check_out &&
			new Date(newCheckIn) >= new Date(searchParams.value.check_out)
		) {
			const checkIn = new Date(newCheckIn)
			checkIn.setDate(checkIn.getDate() + 1)
			searchParams.value.check_out = checkIn.toISOString().split("T")[0]
		}
	},
)
</script>
