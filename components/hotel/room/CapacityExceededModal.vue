<template>
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
			v-if="isOpen"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all"
			>
				<!-- Header -->
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="rounded-full bg-red-100 p-2">
							<AlertTriangleIcon class="h-6 w-6 text-red-500" />
						</div>
						<h3 class="text-lg font-semibold text-gray-900">
							Room Capacity Exceeded
						</h3>
					</div>
					<button
						@click="$emit('close')"
						class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<XIcon class="h-5 w-5" />
					</button>
				</div>

				<!-- Content -->
				<div class="mb-6 space-y-4 rounded-lg bg-red-50 p-4">
					<p class="text-sm text-gray-700">
						<strong>{{ roomName }}</strong> can accommodate up to
						<strong>{{ maxOccupancy }} guests</strong>, but your search is for
						<strong>{{ totalGuests }} guests</strong>.
					</p>
					<div v-if="exceededInfo" class="mt-2 text-xs text-red-500">
						<div v-if="exceededInfo.adult_exceeded > 0">
							Adults exceeded by: {{ exceededInfo.adult_exceeded }}
						</div>
						<div v-if="exceededInfo.child_exceeded > 0">
							Children exceeded by: {{ exceededInfo.child_exceeded }}
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex gap-3">
					<CommonButton
						@click="$emit('close')"
						variant="outline"
						class="flex-1"
					>
						Cancel
					</CommonButton>
					<CommonButton @click="handleSearchNewRooms" class="flex-1">
						Find Better Rooms
					</CommonButton>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { AlertTriangleIcon, XIcon } from "lucide-vue-next"

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
