<template>
	<div class="grid grid-cols-13 overflow-hidden rounded-lg border">
		<NuxtImg
			:src="hotel.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
			:alt="hotel.hotel_name"
			class="col-span-4 h-full w-full object-cover"
		/>
		<div class="col-span-9 flex flex-col justify-center px-4">
			<div class="flex flex-col gap-y-6 border-b py-4 pt-6">
				<div class="flex flex-col gap-y-1">
					<HotelRating :rating="Number(hotel.rating)" />

					<h4 class="text-lg font-semibold">{{ hotel.hotel_name }}</h4>
					<p class="text-muted-foreground">
						{{ hotel.city_name || hotel.country_name }}
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
					<div class="flex items-center gap-x-2">
						<CalendarXIcon />
						<p>Free cancellation</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-1">
					<template v-for="amenity in hotel.amenities" :key="amenity.id">
						<ui-badge variant="secondary">{{ amenity.name }}</ui-badge>
					</template>
				</div>

				<div class="flex items-center gap-x-2">
					<p
						class="bg-chart-6 text-primary-foreground rounded-sm rounded-bl-none px-1.5 py-1 text-xs"
					>
						9.5
					</p>
					<p class="text-chart-6 text-xs">Outstanding</p>
					<p class="text-muted-foreground text-xs">(719)</p>
				</div>
			</div>

			<div class="flex items-center justify-end gap-x-4 py-2">
				<div class="flex flex-col gap-y-0.5 text-right">
					<div class="flex items-center gap-x-2">
						<p class="text-muted-foreground">Avg. Price</p>
						<p class="font-semibold">THB {{ hotel.avg_price }}</p>
					</div>
					<p class="text-muted-foreground text-xs">2 adults / 2 nights</p>
				</div>
				<NuxtLink
					:to="{
						path: `/hotels/${hotel.slug}`,
						query: {
							...route.query,
							search: hotel.hotel_name,
						},
					}"
				>
					<Button>See availability</Button>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CalendarXIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const route = useRoute()

defineProps({
	hotel: {
		type: Object,
		required: true,
	},
})
</script>
