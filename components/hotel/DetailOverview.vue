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
				class="mt-1 !bg-transparent !p-0 !text-gray-800 underline"
			>
				{{ isDescriptionExpanded ? "Show less" : "Read more" }}
				<ChevronDownIcon
					:class="{ 'rotate-180': isDescriptionExpanded }"
					class="size-4"
				/>
			</Button>
		</div>

		<div>
			<div class="flex items-center gap-8 border-t py-4">
				<div class="flex flex-col items-start gap-y-1">
					<div class="flex items-center gap-x-2">
						<p class="text-muted-foreground">Check-in</p>
						<div class="rounded-sm bg-green-100 p-1">
							<ArrowRightIcon class="text-green-700" />
						</div>
					</div>
					<span class="font-medium">{{
						formatTime(hotelData.policy_info?.CheckInTime)
					}}</span>
				</div>
				<div class="flex flex-col items-start gap-y-1">
					<div class="flex items-center gap-x-2">
						<p class="text-muted-foreground">Check-out</p>
						<div class="rounded-sm bg-red-100 p-1">
							<ArrowLeftIcon class="text-red-700" />
						</div>
					</div>
					<span class="font-medium">{{
						formatTime(hotelData.policy_info?.CheckOutTime)
					}}</span>
				</div>
			</div>
			<div class="border-t pt-6">
				<h2 class="mb-6 text-lg font-semibold text-gray-900 md:text-xl">
					Facilities
				</h2>
				<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
					<div
						v-for="amenity in showAllAmenities
							? hotelData.amenities
							: hotelData.amenities?.slice(0, 6)"
						:key="amenity.id"
						class="flex items-center gap-x-1.5"
					>
						<CheckIcon class="text-primary size-4" />
						<span class="text-gray-700">{{ amenity.name }}</span>
					</div>
				</div>
				<Button
					variant="ghost"
					v-if="hotelData.amenities?.length > 6"
					@click="toggleAmenities"
					class="mt-2 !bg-transparent !p-0 !text-gray-800 underline"
				>
					{{ showAllAmenities ? "Show Less" : `View All Amenities` }}
				</Button>
			</div>
		</div>
	</div>
</template>
<script setup>
import { formatTime } from "~/lib/utils"
import {
	StarIcon,
	CheckIcon,
	MapPinIcon,
	ChevronDownIcon,
	ArrowRightIcon,
	ArrowLeftIcon,
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
