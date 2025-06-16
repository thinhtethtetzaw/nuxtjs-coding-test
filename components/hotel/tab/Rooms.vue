<template>
	<div class="min-h-screen">
		<div class="space-y-4">
			<div v-if="isRoomsLoading" class="flex items-center justify-center py-8">
				<CommonSpinnerLoading :is-loading="true" />
			</div>

			<div v-else-if="error" class="rounded-lg bg-red-50 p-4">
				<div class="flex items-center gap-2 text-red-700">
					<AlertTriangleIcon class="h-5 w-5" />
					<p>Failed to load rooms. Please try again.</p>
				</div>
			</div>

			<div v-else-if="!roomsData.length" class="py-8 text-center text-gray-500">
				No rooms available for the selected dates.
			</div>

			<div v-else class="divide-y divide-gray-200">
				<HotelRoomCard v-for="room in roomsData" :key="room.id" :room="room" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { AlertTriangleIcon } from "lucide-vue-next"

const route = useRoute()
const { getParam } = useUrlParams()

const {
	data: rooms,
	pending: isRoomsLoading,
	error,
} = useFetch(`/api/hotels/${route.params.slug}/rooms`, {
	method: "POST",
	lazy: false,
	immediate: true,
	body: {
		check_in: getParam("check_in"),
		check_out: getParam("check_out"),
		rooms: getParam("rooms"),
		adults: getParam("adults"),
		age_of_children: getParam("age_of_children"),
	},
	$fetch: useNuxtApp().$api,
})

const roomsData = computed(() => rooms.value?.data?.rooms || [])
</script>
