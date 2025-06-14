<template>
	<div class="space-y-8">
		<div class="space-y-2">
			<h4 class="text-lg font-semibold text-gray-900">Description</h4>
			<p class="text-gray-700">{{ hotelData.description }}</p>
		</div>
		<div class="grid gap-8 lg:grid-cols-2">
			<div class="rounded-2xl bg-gray-50 p-4">
				<h4 class="mb-4 text-lg font-semibold text-gray-900">Stay Details</h4>
				<div class="space-y-2">
					<div class="flex justify-between py-2">
						<span class="text-gray-600">Room Type</span>
						<span class="font-medium text-gray-900">{{
							hotelData.rooms?.[0]?.room_type || "Standard Room"
						}}</span>
					</div>
					<div class="flex justify-between py-2">
						<span class="text-gray-600">Check-in</span>
						<span class="font-medium text-gray-900">{{
							formatTime(hotelData.policy_info?.CheckInTime)
						}}</span>
					</div>
					<div class="flex justify-between py-2">
						<span class="text-gray-600">Check-out</span>
						<span class="font-medium text-gray-900">{{
							formatTime(hotelData.policy_info?.CheckOutTime)
						}}</span>
					</div>
					<div class="flex justify-between py-2">
						<span class="text-gray-600">Guests</span>
						<span class="font-medium text-gray-900"
							>{{ hotelData.rooms?.[0]?.max_occupancy || 2 }} Travellers</span
						>
					</div>
					<div class="flex justify-between">
						<div><span class="text-gray-900">Average Price</span></div>
						<span class="text-primary text-xl font-bold"
							>{{ hotelData.currency }} {{ hotelData.avg_price }}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { formatTime } from "~/utils"

defineProps({
	hotelData: {
		type: Object,
		required: true,
	},
})
</script>
