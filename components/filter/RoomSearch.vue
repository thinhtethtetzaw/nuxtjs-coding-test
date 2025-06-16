<template>
	<form class="w-full">
		<div v-if="isCompact" class="flex items-center gap-3">
			<div class="w-[200px] flex-shrink-0">
				<Popover>
					<PopoverTrigger as-child>
						<Button
							variant="outline"
							:class="
								cn(
									'w-full justify-start text-left font-normal',
									!checkInDate && 'text-muted-foreground',
								)
							"
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{{ formatDisplayDate(checkInDate) }}
						</Button>
					</PopoverTrigger>
					<PopoverContent class="w-auto p-0">
						<Calendar v-model="checkInDate" :min="today" initial-focus />
					</PopoverContent>
				</Popover>
			</div>

			<div class="w-[200px] flex-shrink-0">
				<Popover>
					<PopoverTrigger as-child>
						<Button
							variant="outline"
							:class="
								cn(
									'w-full justify-start text-left font-normal',
									!checkOutDate && 'text-muted-foreground',
								)
							"
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{{ formatDisplayDate(checkOutDate) }}
						</Button>
					</PopoverTrigger>
					<PopoverContent class="w-auto p-0">
						<Calendar
							v-model="checkOutDate"
							:min="minCheckOutDate"
							initial-focus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<!-- Guests & Rooms  -->
			<div class="relative max-w-72 flex-shrink-0">
				<Popover v-model:open="showGuestSelector">
					<PopoverTrigger as-child>
						<Button
							variant="outline"
							:class="cn('w-full justify-start text-left font-normal')"
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
									<span class="text-gray-500"
										>Room{{ rooms > 1 ? "s" : "" }}</span
									>
								</div>
								<ChevronDownIcon
									class="ml-1 h-4 w-4 flex-shrink-0 text-gray-400"
								/>
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent class="w-80 p-4">
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
						<Button
							type="button"
							@click="onGuestSelectorDone"
							class="w-full !bg-gray-800"
						>
							Done
						</Button>
					</PopoverContent>
				</Popover>
			</div>

			<!-- Search Button -->
			<Button type="button" @click="emit('search-hotels')">
				<SearchIcon class="size-4 text-white" />
				Search
			</Button>
		</div>
	</form>
</template>

<script setup>
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useUrlParams } from "~/composables/useUrlParams"
import { ChevronDownIcon, SearchIcon, CalendarIcon } from "lucide-vue-next"
import { createUrlParamComputed, createDateParamComputed, cn } from "~/utils"

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

const formatDisplayDate = (date) => {
	if (!date) return "Pick a date"
	return dayjs(date).format("MMM D, YYYY")
}

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
