<template>
	<div class="grid gap-8 lg:grid-cols-2">
		<div class="bg-accent rounded-2xl p-4">
			<h4 class="mb-6 text-lg font-semibold text-gray-900">Hotel Facilities</h4>
			<div class="space-y-2">
				<div
					v-for="amenity in hotelData.amenities"
					:key="amenity.id"
					class="flex items-center gap-3"
				>
					<CheckIcon class="text-primary h-4 w-4" />
					<span class="text-gray-700">{{ amenity.name }}</span>
				</div>
			</div>
		</div>
		<div class="bg-accent rounded-2xl p-4">
			<h4 class="mb-6 text-lg font-semibold text-gray-900">Room Features</h4>
			<div class="space-y-2">
				<div
					v-for="amenity in hotelData.rooms?.[0]?.amenities"
					:key="amenity.id"
					class="flex items-center gap-3"
				>
					<CheckIcon class="text-primary h-4 w-4" />
					<span class="text-gray-700">{{ amenity.amenity_name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { CheckIcon } from "lucide-vue-next"
defineProps({ hotelData: Object })
</script>
