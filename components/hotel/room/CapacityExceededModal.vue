<template>
	<CommonBaseDialog
		:is-open="isOpen"
		@update:isOpen="$emit('close')"
		@confirm="handleSearchNewRooms"
		title="Room Capacity Exceeded"
		confirm-text="Find Better Rooms"
	>
		<template #header>
			<div class="flex items-center gap-3">
				<div class="rounded-full bg-red-100 p-2">
					<AlertTriangleIcon class="h-6 w-6 text-red-500" />
				</div>
				<DialogTitle>Room Capacity Exceeded</DialogTitle>
			</div>
		</template>

		<div class="space-y-4 rounded-lg bg-red-50 p-4">
			<p class="text-sm text-gray-700">
				<strong>{{ roomName }}</strong> can accommodate up to
				<strong>{{ maxOccupancy }} guests</strong>, but your search is for
				<strong>{{ totalGuests }} guests</strong>.
			</p>
			<div v-if="exceededInfo" class="mt-2 text-red-500">
				<div v-if="exceededInfo.adult_exceeded > 0">
					Adults exceeded by: {{ exceededInfo.adult_exceeded }}
				</div>
				<div v-if="exceededInfo.child_exceeded > 0">
					Children exceeded by: {{ exceededInfo.child_exceeded }}
				</div>
			</div>
		</div>
	</CommonBaseDialog>
</template>

<script setup>
import { AlertTriangleIcon } from "lucide-vue-next"
import { DialogTitle } from "@/components/ui/dialog"

const props = defineProps({
	isOpen: { type: Boolean, required: true },
	roomName: { type: String, required: true },
	maxOccupancy: { type: Number, required: true },
	totalGuests: { type: Number, required: true },
	exceededInfo: { type: Object, default: null },
})

const emit = defineEmits(["close", "search-new-rooms"])

const handleSearchNewRooms = () => {
	emit("search-new-rooms")
}
</script>
