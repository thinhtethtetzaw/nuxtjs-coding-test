<template>
	<div class="space-y-8">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="mb-4 flex items-center gap-4">
					<div class="flex items-center gap-2">
						<div class="flex items-center">
							<StarIcon
								v-for="n in 5"
								:key="'star-' + n"
								:class="[
									n <= Math.floor(Number(hotelData.rating))
										? 'fill-yellow-400 text-yellow-400'
										: 'fill-gray-300 text-gray-300',
									'h-4 w-4',
								]"
							/>
						</div>
					</div>
				</div>
				<h1 class="mb-2 text-3xl font-semibold text-gray-700">
					{{ hotelData.hotel_name }}
				</h1>
				<div class="flex items-center gap-x-2">
					<MapPinIcon class="size-4" />
					<p>
						{{ hotelData.address?.[0]?.postalCode }},
						{{ hotelData.address?.[0]?.cityName }},
						{{ hotelData.address?.[0]?.countryName }}
					</p>
				</div>
			</div>
			<div class="col-span-4 flex flex-col items-end gap-y-4">
				<div class="text-right">
					<p class="text-muted-foreground">Avg. Price</p>
					<p class="text-xl font-semibold text-gray-800">
						{{ hotelData.currency }} {{ hotelData.avg_price }}
					</p>
				</div>
			</div>
		</div>
		<div class="text-muted-foreground">
			<p
				:class="{
					'line-clamp-2': !isDescriptionExpanded,
				}"
			>
				{{ hotelData.description }}
			</p>
			<Button
				variant="ghost"
				v-if="hotelData.description.length > 200"
				@click="isDescriptionExpanded = !isDescriptionExpanded"
				class="mt-1 !p-0 !text-gray-800 underline"
			>
				{{ isDescriptionExpanded ? "Show less" : "Read more" }}
				<ChevronDownIcon
					:class="{ 'rotate-180': isDescriptionExpanded }"
					class="size-4"
				/>
			</Button>
		</div>

		<div>
			<div class="mt-4 flex items-center gap-8 border-t border-gray-200 pt-4">
				<div class="flex flex-col items-start gap-y-2">
					<span class="text-gray-600">Check-in</span>
					<span class="font-medium text-gray-900">{{
						formatTime(hotelData.policy_info?.CheckInTime)
					}}</span>
				</div>
				<div class="flex flex-col items-start gap-y-2">
					<span class="text-gray-600">Check-out</span>
					<span class="font-medium text-gray-900">{{
						formatTime(hotelData.policy_info?.CheckOutTime)
					}}</span>
				</div>
			</div>
			<h2
				class="text-gray-90 mt-4 mb-6 border-t border-gray-200 pt-4 text-xl font-semibold"
			>
				Facilities
			</h2>
			<div class="grid grid-cols-3 gap-6">
				<div
					v-for="amenity in showAllAmenities
						? hotelData.amenities
						: hotelData.amenities?.slice(0, 6)"
					:key="amenity.id"
					class="flex items-center gap-3"
				>
					<CheckIcon class="text-primary size-4" />
					<span class="text-gray-700">{{ amenity.name }}</span>
				</div>
			</div>
			<Button
				variant="ghost"
				v-if="hotelData.amenities?.length > 6"
				@click="toggleAmenities"
			>
				{{ showAllAmenities ? "Show Less" : `View All Amenities` }}
			</Button>
		</div>
	</div>
</template>
<script setup>
import { formatTime } from "~/utils"
import {
	StarIcon,
	CheckIcon,
	MapPinIcon,
	ChevronDownIcon,
} from "lucide-vue-next"
import { Button } from "@/components/ui/button"

defineProps({
	hotelData: {
		type: Object,
		required: true,
	},
})
const showAllAmenities = ref(false)
const isDescriptionExpanded = ref(false)

const toggleAmenities = () => {
	showAllAmenities.value = !showAllAmenities.value
}
</script>
