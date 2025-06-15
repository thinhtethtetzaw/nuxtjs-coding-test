<template>
	<div class="grid grid-cols-12 gap-4 py-4">
		<!-- Left: Image and Room Info -->
		<div class="col-span-5 flex flex-col gap-y-6">
			<HotelRoomGallery
				:images="room.gallery"
				:room-name="room.room_type"
				@open-gallery="openRoomGallery"
			/>
			<div class="flex-1 space-y-4">
				<h4 class="mb-3 text-xl font-semibold text-gray-900">
					{{ room.room_type }}
				</h4>
				<div class="flex flex-col items-start">
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<UsersIcon class="size-4 text-gray-600" />
							<span>Max {{ room.max_occupancy }} guests</span>
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<RulerIcon class="size-4 text-gray-600" />
							<span>{{ room.size_measurement || "Spacious room" }}</span>
						</div>
						<div
							v-for="amenity in room.amenities?.slice(0, 2)"
							:key="amenity.id"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<CheckIcon class="text-primary size-3" />
							<span>{{ amenity.amenity_name }}</span>
						</div>
					</div>
					<CommonButton
						v-if="room.amenities?.length > 2"
						@click="openRoomGallery"
						variant="ghost"
						class="p-0 underline"
					>
						View all amenities
					</CommonButton>
				</div>
			</div>
		</div>
		<!-- Right: Rate Plans -->
		<div class="col-span-7 space-y-3">
			<div
				v-for="(ratePlan, planIndex) in room.rate_plans?.slice(0, 2)"
				:key="ratePlan.id"
				class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
			>
				<div class="mb-3 flex items-start justify-between">
					<span class="font-medium text-gray-900">
						{{ ratePlan.rate_plan_name }}
					</span>
					<div class="text-right">
						<span class="text-xl font-semibold text-gray-900">
							{{ ratePlan.pivot?.head_currency_code }}
							{{ ratePlan.pivot?.price }}
						</span>
						<p class="text-xs text-gray-500">per night for 1 room</p>
					</div>
				</div>
				<div class="mb-3">
					<p class="mb-2 text-sm font-medium text-gray-700">Inclusions</p>
					<div class="space-y-1">
						<div
							v-if="ratePlan.include_breakfast"
							class="flex items-center gap-2 text-xs text-gray-600"
						>
							<CheckIcon class="text-primary size-3" />
							<span>Free Breakfast</span>
						</div>
						<div
							v-for="benefit in ratePlan.benefits?.slice(0, 2)"
							:key="benefit.id"
							class="flex items-center gap-2 text-xs text-gray-600"
						>
							<CheckIcon class="text-primary size-3" />
							<span>{{ benefit.hint }}</span>
						</div>
						<div
							v-if="!ratePlan.no_cancel_ind"
							class="flex items-center gap-2 text-xs text-gray-600"
						>
							<CheckIcon class="text-primary size-3" />
							<span>Free Cancellation</span>
						</div>
						<CommonButton
							v-if="ratePlan.benefits?.length > 2"
							@click="openRoomGallery"
							variant="ghost"
							class="p-0 text-xs underline"
						>
							More details
						</CommonButton>
					</div>
				</div>
				<p
					v-if="ratePlan.cancel_penalty_description"
					class="mb-3 text-xs text-orange-500"
				>
					{{ ratePlan.cancel_penalty_description.substring(0, 50) }}...
				</p>
				<CommonButton type="button" class="w-full" @click="handleBookNow">
					Book Now
				</CommonButton>
			</div>
		</div>
		<HotelRoomGalleryModal
			:is-open="isRoomGalleryOpen"
			:images="room.gallery"
			:room="room"
			@close="closeRoomGallery"
		/>
	</div>
</template>

<script setup>
import { UsersIcon, RulerIcon, CheckIcon } from "lucide-vue-next"

// Props
const props = defineProps({
	room: { type: Object, required: true },
})

const isRoomGalleryOpen = ref(false)
const openRoomGallery = () => {
	isRoomGalleryOpen.value = true
}
const closeRoomGallery = () => {
	isRoomGalleryOpen.value = false
}

const handleBookNow = () => {
	console.log("Book Now")
}
</script>
