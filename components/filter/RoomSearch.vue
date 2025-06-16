<template>
	<form class="w-full">
		<div v-if="isCompact" class="flex items-center gap-3">
			<div class="w-36 flex-shrink-0">
				<input
					v-model="checkInDate"
					type="date"
					required
					:min="today"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="w-36 flex-shrink-0">
				<input
					v-model="checkOutDate"
					type="date"
					required
					:min="minCheckOutDate"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<!-- Guests & Rooms  -->
			<div class="relative max-w-72 flex-shrink-0">
				<button
					type="button"
					@click="showGuestSelector = !showGuestSelector"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all duration-150 hover:border-gray-300 hover:shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 text-gray-900">
							<span class="font-medium">{{ adults }}</span>
							<span class="text-gray-500"
								>Adult{{ adults > 1 ? "s" : "" }}</span
							>
							<span v-if="children > 0" class="text-gray-400">•</span>
							<template v-if="children > 0">
								<span class="font-medium">{{ children }}</span>
								<span class="text-gray-500"
									>Child{{ children > 1 ? "ren" : "" }}</span
								>
							</template>
							<span class="text-gray-400">•</span>
							<span class="font-medium">{{ rooms }}</span>
							<span class="text-gray-500">Room{{ rooms > 1 ? "s" : "" }}</span>
						</div>
						<ChevronDownIcon class="ml-1 h-4 w-4 flex-shrink-0 text-gray-400" />
					</div>
				</button>

				<!--  Guest Selector Dropdown -->
				<div
					v-if="showGuestSelector"
					class="absolute top-full right-0 z-10 mt-1 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
				>
					<div class="space-y-4 pb-4">
						<!-- Rooms -->
						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Number of room needed</p>
							<CommonCounter v-model="rooms" label="Room" :min="1" />
						</div>

						<!-- Adults -->
						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Ages 18 or above</p>
							<CommonCounter v-model="adults" label="Adults" :min="1" />
						</div>

						<!-- Children -->
						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Ages 8-14</p>
							<CommonCounter v-model="children" label="Children" :min="0" />
						</div>

						<!-- Children Ages -->
						<div v-if="children > 0">
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
										@change="updateAgeOfChildren"
										class="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									>
										<option value="" disabled class="text-gray-400">
											Child {{ index + 1 }} age
										</option>
										<option value="0" class="text-gray-900">
											Less than 1 year
										</option>
										<option
											v-for="age in 17"
											:key="age"
											:value="age"
											class="text-gray-900"
										>
											{{ age }} years old
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
			<CommonButton type="button" class="px-6" @click="emit('search-hotels')">
				<SearchIcon class="size-4 text-white" />
				<span class="ml-2">Search</span>
			</CommonButton>
		</div>

		<!-- Searchbar Layout for Banner -->
		<div v-else class="grid grid-cols-12 gap-4">
			<div class="col-span-12 md:col-span-3">
				<label class="mb-2 block text-sm font-medium text-gray-700">
					Check-in Date
				</label>
				<input
					v-model="checkInDate"
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
					v-model="checkOutDate"
					type="date"
					required
					:min="minCheckOutDate"
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
											<span class="font-medium">{{ adults }}</span>
											<span class="text-gray-500"
												>Adult{{ adults > 1 ? "s" : "" }}</span
											>
											<span v-if="children > 0" class="text-gray-400">•</span>
											<template v-if="children > 0">
												<span class="font-medium">{{ children }}</span>
												<span class="text-gray-500"
													>Child{{ children > 1 ? "ren" : "" }}</span
												>
											</template>
											<span class="text-gray-400">•</span>
											<span class="font-medium">{{ rooms }}</span>
											<span class="text-gray-500"
												>Room{{ rooms > 1 ? "s" : "" }}</span
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
										<CommonCounter v-model="rooms" label="Room" :min="1" />
									</div>

									<!-- Adults -->
									<div class="space-y-2 py-2">
										<p class="text-sm text-gray-500">Ages 18 or above</p>
										<CommonCounter v-model="adults" label="Adult" :min="1" />
									</div>

									<!-- Children -->
									<div class="space-y-2 py-2">
										<p class="text-sm text-gray-500">Ages 8-14</p>
										<CommonCounter
											v-model="children"
											label="Children"
											:min="0"
										/>
									</div>

									<!-- Children Ages -->
									<div v-if="children > 0">
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
													@change="updateAgeOfChildren"
													class="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												>
													<option value="" disabled class="text-gray-400">
														Child {{ index + 1 }} age
													</option>
													<option value="0" class="text-gray-900">
														Less than 1 year
													</option>
													<option
														v-for="age in 17"
														:key="age"
														:value="age"
														class="text-gray-900"
													>
														{{ age }} years old
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
							type="button"
							class="w-full"
							@click="emit('search-hotels')"
						>
							<SearchIcon class="size-4 text-white" />
							<span class="ml-2">Search</span>
						</CommonButton>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script setup>
import { useUrlParams } from "~/composables/useUrlParams"
import { ChevronDownIcon, SearchIcon } from "lucide-vue-next"
import dayjs from "dayjs"
import { createUrlParamComputed, createDateParamComputed } from "~/utils"

const props = defineProps({
	isCompact: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["search-hotels"])

const showGuestSelector = ref(false)
const childrenAges = ref([])

const today = computed(() => {
	return dayjs().format("YYYY-MM-DD")
})

const tomorrow = computed(() => {
	return dayjs().add(1, "day").format("YYYY-MM-DD")
})

const { getParam, setParam } = useUrlParams({
	check_in: null,
	check_out: null,
	adults: null,
	rooms: null,
	age_of_children: null,
})

const defaultParams = {
	check_in: today.value,
	check_out: tomorrow.value,
	adults: 1,
	rooms: 1,
}

onMounted(() => {
	Object.entries(defaultParams).forEach(([key, value]) => {
		if (!getParam(key)) {
			setParam(key, value)
		}
	})

	const ageOfChildren = getParam("age_of_children")
	childrenAges.value = ageOfChildren
		? ageOfChildren.split(",")
		: Array(children.value).fill("")
})

const checkInDate = createDateParamComputed(
	getParam,
	setParam,
	"check_in",
	null,
	"check_out",
	true,
)
const checkOutDate = createDateParamComputed(
	getParam,
	setParam,
	"check_out",
	null,
	"check_in",
	false,
)

const minCheckOutDate = computed(() => {
	const checkIn = getParam("check_in")
	if (!checkIn) return today.value

	const nextDay = dayjs(checkIn).add(1, "day")
	return nextDay.format("YYYY-MM-DD")
})

const rooms = createUrlParamComputed(getParam, setParam, "rooms", 1, Number)
const adults = createUrlParamComputed(getParam, setParam, "adults", 1, Number)
const children = createUrlParamComputed(
	getParam,
	setParam,
	"children",
	0,
	(value) => {
		const numValue = Number(value)
		return isNaN(numValue) ? 0 : Math.max(0, numValue)
	},
)

const updateAgeOfChildren = () => {
	if (
		childrenAges.value.length > 0 &&
		childrenAges.value.some((age) => age !== "")
	) {
		setParam("age_of_children", childrenAges.value.join(","))
	}
}

const onGuestSelectorDone = () => {
	setParam("rooms", rooms.value)
	setParam("adults", adults.value)
	setParam("children", children.value)
	updateAgeOfChildren() // Ensure ages are saved when done
	showGuestSelector.value = false
}

watch(checkInDate, (newValue) => {
	const checkIn = new Date(newValue)
	const checkOut = new Date(getParam("check_out"))
	if (checkOut <= checkIn) {
		const nextDay = new Date(checkIn)
		nextDay.setDate(nextDay.getDate() + 1)
		setParam("check_out", dayjs(nextDay).format("YYYY-MM-DD"))
	}
})

watch(
	[children, () => getParam("age_of_children")],
	([newChildrenCount, newAgeOfChildren]) => {
		if (newChildrenCount !== undefined) {
			const existingAges = [...childrenAges.value]
			childrenAges.value = Array(newChildrenCount)
				.fill("")
				.map((_, index) => existingAges[index] || "")
		}

		if (newAgeOfChildren) {
			childrenAges.value = newAgeOfChildren.split(",")
		} else if (children.value > 0 && !newAgeOfChildren) {
			childrenAges.value = Array(children.value).fill("")
		}

		if (childrenAges.value.some((age) => age !== "")) {
			updateAgeOfChildren()
		}
	},
	{ immediate: true, deep: true },
)
</script>
