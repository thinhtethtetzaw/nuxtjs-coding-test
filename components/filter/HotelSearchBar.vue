<template>
	<div
		class="hidden w-full grid-cols-12 items-center bg-white md:grid lg:max-w-5xl lg:min-w-4xl lg:px-4 xl:py-2"
		:class="
			fullWidth
				? 'mx-auto px-12'
				: 'min-w-[600px] rounded-xl border border-gray-200 px-2 shadow-lg lg:rounded-2xl'
		"
	>
		<Popover v-model:open="showSearchResults">
			<PopoverTrigger as-child>
				<div
					class="col-span-4 flex cursor-pointer items-center gap-2 py-2 lg:gap-4"
				>
					<div
						class="flex size-8 items-center justify-center rounded-md bg-gray-200 p-2 lg:mb-1 lg:size-11 lg:rounded-xl"
					>
						<MapPinIcon class="size-4 lg:size-5" />
					</div>
					<div class="flex flex-col lg:gap-1">
						<p class="text-xs font-semibold text-gray-900 lg:text-sm">Where</p>
						<div class="relative">
							<Input
								v-model="search"
								type="text"
								placeholder="Search destinations"
								@input="onInputChange"
								@keydown.enter.prevent="onSearchSubmit"
								class="!md:text-xs h-auto border-none bg-transparent text-gray-500 placeholder-gray-400 shadow-none focus-visible:ring-0 md:px-0 lg:text-sm"
							/>
							<XIcon
								v-if="search"
								class="absolute top-1/2 -right-3 size-4 -translate-y-1/2 cursor-pointer text-gray-500"
								@click="onClearSearch"
							/>
						</div>
					</div>
				</div>
			</PopoverTrigger>
			<PopoverContent
				v-if="
					search &&
					searchResults &&
					searchResults.data &&
					Number(searchResults.data.length ?? 0) > 0 &&
					!isLoading
				"
				class="max-h-68 min-h-16 w-auto min-w-64 overflow-y-auto p-0 lg:min-w-96"
				align="start"
			>
				<div
					v-for="result in searchResults?.data"
					:key="result.id || result.slug"
					class="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-blue-50"
					@click="onSelect(result)"
				>
					<div>
						<p class="text-sm font-medium text-gray-900 lg:text-sm">
							{{ result.hotel_name }}
						</p>
						<p
							v-if="result.city_name || result.country_name"
							class="text-xs text-gray-500 lg:text-sm"
						>
							{{ result.city_name }} {{ result.country_name }}
						</p>
					</div>
				</div>
			</PopoverContent>
		</Popover>

		<!-- Check In Field -->
		<Popover v-model:open="showCheckInCalendar">
			<PopoverTrigger as-child>
				<div class="col-span-2 cursor-pointer border-l border-gray-200">
					<div class="flex flex-col items-center">
						<div>
							<div class="text-xs font-semibold text-gray-900 lg:text-sm">
								Check in
							</div>
							<div
								class="mt-1 text-xs text-gray-500 lg:mt-2 lg:text-sm"
								v-if="checkInDate"
							>
								{{ dayjs(checkInDate).format("YYYY-MM-DD") }}
							</div>
							<div v-else class="mt-1 text-xs text-gray-400 lg:mt-2 lg:text-sm">
								Add dates
							</div>
						</div>
					</div>
				</div>
			</PopoverTrigger>
			<PopoverContent class="w-auto p-0" align="start">
				<Calendar
					v-model="calendarCheckInDate"
					mode="single"
					:min="today"
					required
				/>
			</PopoverContent>
		</Popover>

		<!-- Check Out Field -->
		<Popover v-model:open="showCheckOutCalendar">
			<PopoverTrigger as-child>
				<div class="col-span-2 cursor-pointer border-l border-gray-200">
					<div class="flex flex-col items-center">
						<div>
							<div class="text-xs font-semibold text-gray-900 lg:text-sm">
								Check out
							</div>
							<div
								class="mt-1 text-xs text-gray-500 lg:mt-2 lg:text-sm"
								v-if="checkOutDate"
							>
								{{ dayjs(checkOutDate).format("YYYY-MM-DD") }}
							</div>
							<div v-else class="mt-1 text-xs text-gray-400 lg:mt-2 lg:text-sm">
								Add dates
							</div>
						</div>
					</div>
				</div>
			</PopoverTrigger>
			<PopoverContent class="w-auto p-0" align="start">
				<Calendar
					v-model="calendarCheckOutDate"
					mode="single"
					:min="minCheckOutDate"
					required
				/>
			</PopoverContent>
		</Popover>

		<Popover v-model:open="showGuestSelector">
			<PopoverTrigger as-child>
				<div class="col-span-3 border-l border-gray-200">
					<div class="flex flex-col items-center">
						<div>
							<div class="text-xs font-semibold text-gray-900 lg:text-sm">
								Room & Guests
							</div>
							<div
								class="mt-1 text-xs text-gray-500 lg:text-sm"
								v-if="adults + children + rooms > 0"
							>
								{{ adults + children }} Guest{{
									adults + children > 1 ? "s" : ""
								}}
								<span class="text-gray-400">• </span>
								<span class="font-medium">{{ rooms }}</span>
								<span class="text-gray-500">
									Room{{ rooms > 1 ? "s" : "" }}</span
								>
							</div>
							<div v-else class="mt-1 text-xs text-gray-400 lg:text-sm">
								Add here
							</div>
						</div>
					</div>
				</div>
			</PopoverTrigger>
			<PopoverContent class="w-80" align="start">
				<div>
					<div class="space-y-4 divide-y divide-gray-100">
						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Number of room needed</p>
							<CommonCounter v-model="rooms" label="Room" :min="1" />
						</div>

						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Ages 18 or above</p>
							<CommonCounter v-model="adults" label="Adult" :min="1" />
						</div>

						<div class="space-y-2 py-2">
							<p class="text-sm text-gray-500">Ages 8-14</p>
							<CommonCounter v-model="children" label="Children" :min="0" />
						</div>

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
									v-for="(_, index) in childrenAges"
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

					<Button
						type="button"
						@click="onGuestSelectorDone"
						class="w-full !bg-gray-800"
					>
						Done
					</Button>
				</div>
			</PopoverContent>
		</Popover>

		<div class="col-span-1 flex items-center justify-end">
			<Button
				@click="emit('search-hotels')"
				class="size-8 cursor-pointer rounded-md text-white lg:size-12 lg:rounded-xl xl:size-14"
			>
				<SearchIcon class="size-5 lg:size-6" />
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { SearchIcon, MapPinIcon, XIcon, ChevronDownIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useUrlParams } from "~/composables/useUrlParams"
import { useDebounceFn } from "@vueuse/core"
import { createUrlParamComputed, createDateParamComputed } from "~/utils"
import { parseDate } from "@internationalized/date"
import { useHotelSearch } from "~/composables/useHotelSearch"

const route = useRoute()
const router = useRouter()

defineProps({
	fullWidth: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["search-hotels", "clear-search"])

const { getParam, setParam } = useUrlParams({
	search: null as string | null,
	check_in: null as string | null,
	check_out: null as string | null,
	adults: null,
	rooms: null,
	children: null,
	age_of_children: null as string | null,
})
const search = ref(getParam("search") || "")
const childrenAges = ref<string[]>([])

const showSearchResults = ref(false)
const showCheckInCalendar = ref(false)
const showCheckOutCalendar = ref(false)
const showGuestSelector = ref(false)

const searchBody = computed(() => {
	const search = getParam("search") as string | null
	return search?.trim() ? { search: search.trim() } : undefined
})

const {
	data: searchResults,
	loading: isLoading,
	executeSearch,
} = useHotelSearch()

const debouncedExecute = useDebounceFn(() => {
	executeSearch(searchBody.value)
	showSearchResults.value = true
}, 1000)

watch(
	() => getParam("search"),
	(newVal) => {
		search.value = newVal || ""
	},
)

const onClearSearch = () => {
	search.value = ""
	setParam("search", "")
	emit("clear-search")
}

const onInputChange = (e: Event) => {
	const target = e.target as HTMLInputElement
	search.value = target.value
	setParam("search", target.value)
	debouncedExecute()
}

const onSearchSubmit = () => {
	executeSearch(searchBody.value)
	showSearchResults.value = true
}

const onSelect = (result: any) => {
	router.push({
		path: `/hotels/${result?.slug}`,
		query: { ...route.query, search: result?.hotel_name },
	})
}

//Date
const today = computed(() => {
	return dayjs().format("YYYY-MM-DD")
})

const tomorrow = computed(() => {
	return dayjs().add(1, "day").format("YYYY-MM-DD")
})

const defaultParams = {
	check_in: today.value,
	check_out: tomorrow.value,
	adults: 1,
	rooms: 1,
}

onMounted(() => {
	Object.entries(defaultParams).forEach(([key, value]) => {
		if (!getParam(key as keyof typeof defaultParams)) {
			setParam(key as keyof typeof defaultParams, value as string)
		}
	})

	const ageOfChildren = getParam("age_of_children")
	childrenAges.value = ageOfChildren
		? ageOfChildren.split(",")
		: Array(children.value).fill("")
})

const checkInDate = createDateParamComputed(
	getParam as (key: string) => string | null,
	setParam as (key: string, value: any) => void,
	"check_in",
	"check_out",
	true,
)

const checkOutDate = createDateParamComputed(
	getParam as (key: string) => string | null,
	setParam as (key: string, value: any) => void,
	"check_out",
	"check_in",
	false,
)

const calendarCheckInDate = computed({
	get: () => (checkInDate.value ? parseDate(checkInDate.value) : undefined),
	set: (val) => {
		checkInDate.value = val ? dayjs(val.toString()).format("YYYY-MM-DD") : ""
	},
})

const calendarCheckOutDate = computed({
	get: () => (checkOutDate.value ? parseDate(checkOutDate.value) : undefined),
	set: (val) => {
		checkOutDate.value = val ? dayjs(val.toString()).format("YYYY-MM-DD") : ""
	},
})

const minCheckOutDate = computed(() => {
	const checkIn = getParam("check_in")
	if (!checkIn) return today.value

	const nextDay = dayjs(checkIn).add(1, "day")
	return nextDay.format("YYYY-MM-DD")
})

const rooms = createUrlParamComputed(
	getParam as (key: string) => string | null,
	setParam as (key: string, value: any) => void,
	"rooms",
	1,
	Number,
)
const adults = createUrlParamComputed(
	getParam as (key: string) => string | null,
	setParam as (key: string, value: any) => void,
	"adults",
	1,
	Number,
)
const children = createUrlParamComputed(
	getParam as (key: string) => string | null,
	setParam as (key: string, value: any) => void,
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
	updateAgeOfChildren()
	showGuestSelector.value = false
}

watch(checkInDate, (newValue) => {
	const checkIn = newValue ? new Date(newValue) : null
	const checkOutValue = getParam("check_out")
	const checkOut = checkOutValue ? new Date(checkOutValue) : null
	if (checkIn && checkOut && checkOut <= checkIn) {
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
