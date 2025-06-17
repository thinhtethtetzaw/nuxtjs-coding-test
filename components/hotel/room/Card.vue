<template>
	<div class="grid grid-cols-12 gap-4">
		<!-- Left: Image and Room Info -->
		<div class="col-span-12 flex flex-col gap-y-6 md:col-span-5">
			<HotelRoomGallery
				:images="room.gallery"
				:room-name="room.room_type"
				@open-gallery="toggleRoomGallery"
			/>
			<div class="flex-1 space-y-4">
				<h4 class="mb-3 text-lg font-semibold text-gray-900 md:text-xl">
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
					<Button
						v-if="room.amenities?.length > 2"
						@click="toggleRoomGallery"
						variant="ghost"
						class="!bg-transparent !p-0 underline"
					>
						View all amenities
					</Button>
				</div>
			</div>
		</div>
		<!-- Right: Rate Plans -->
		<div class="col-span-12 space-y-3 md:col-span-7">
			<div
				v-for="(ratePlan, planIndex) in room.rate_plans?.slice(0, 2)"
				:key="ratePlan.id"
				class="flex flex-col gap-y-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
			>
				<div class="flex items-start justify-between gap-2">
					<span class="font-semibold md:text-lg">
						{{ ratePlan.rate_plan_name }}
					</span>
					<div class="text-right">
						<span class="font-semibold md:text-lg">
							{{ ratePlan.pivot?.head_currency_code }}
							{{ ratePlan.pivot?.price }}
						</span>
						<p class="text-xs text-gray-500">per night for 1 room</p>
					</div>
				</div>
				<div class="">
					<p class="mb-2 text-sm font-medium text-gray-700">Inclusions</p>
					<div class="space-y-0.5">
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
						<Button
							v-if="ratePlan.benefits?.length > 2"
							@click="toggleRoomGallery"
							variant="ghost"
							class="p-0 text-xs underline"
						>
							More details
						</Button>
					</div>
				</div>
				<p
					v-if="ratePlan.cancel_penalty_description"
					class="mb-3 text-xs text-orange-500"
				>
					{{ ratePlan.cancel_penalty_description.substring(0, 50) }}...
				</p>
				<Button type="button" class="w-full" @click="handleBookNow">
					Book Now
				</Button>
			</div>
		</div>

		<HotelRoomGalleryModal
			:is-open="isRoomGalleryOpen"
			:images="room.gallery"
			:room="room"
			@close="toggleRoomGallery"
		/>
		<HotelRoomCapacityExceededModal
			:is-open="isCapacityModalOpen"
			:room-name="room.room_type"
			:max-occupancy="room.max_occupancy"
			:total-guests="totalGuests"
			:exceeded-info="room.exceeded"
			@close="toggleCapacityModal"
			@search-new-rooms="handleSearchNewRooms"
		/>

		<CommonBaseDialog
			:is-open="isBookingConfirmModalOpen"
			@update:isOpen="toggleBookingConfirmModal"
			@confirm="handleBookingConfirmed"
			title="Booking Confirmation"
			description="Are you sure you want to book this room?"
			confirm-text="Confirm Booking"
		/>

		<CommonToast
			:is-visible="isToastVisible"
			message="Room booked successfully!"
		/>
	</div>
</template>

<script setup>
import { UsersIcon, RulerIcon, CheckIcon } from "lucide-vue-next"
import { useUrlParams } from "~/composables/useUrlParams"
import { Button } from "@/components/ui/button"

const props = defineProps({
	room: { type: Object, required: true },
})

const router = useRouter()
const route = useRoute()

const { getParam } = useUrlParams({
	adults: null,
	children: null,
	rooms: null,
})

const isRoomGalleryOpen = ref(false)
const isCapacityModalOpen = ref(false)
const isBookingConfirmModalOpen = ref(false)
const isToastVisible = ref(false)

const toggleRoomGallery = () => {
	isRoomGalleryOpen.value = !isRoomGalleryOpen.value
}

const toggleCapacityModal = () => {
	isCapacityModalOpen.value = !isCapacityModalOpen.value
}

const toggleBookingConfirmModal = () => {
	isBookingConfirmModalOpen.value = !isBookingConfirmModalOpen.value
}

const handleBookingConfirmed = () => {
	toggleBookingConfirmModal()
	isToastVisible.value = true
	setTimeout(() => {
		isToastVisible.value = false
	}, 3000)
}

// Calculate total guests from URL parameters
const totalGuests = computed(() => {
	const adults = parseInt(getParam("adults")) || 2
	const children = parseInt(getParam("children")) || 0
	return adults + children
})

const handleBookNow = () => {
	if (props.room.exceeded?.is_exceeded) {
		toggleCapacityModal()
	} else {
		toggleBookingConfirmModal()
	}
}

const handleSearchNewRooms = () => {
	toggleCapacityModal()
	router.push({
		path: "/",
		query: {
			...route.query,
		},
	})
}
</script>
