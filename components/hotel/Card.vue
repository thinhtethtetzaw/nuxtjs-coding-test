<template>
	<NuxtLink
		:to="{
			path: `/hotels/${hotel.slug}`,
			query: {
				...route.query,
				search: hotel.hotel_name,
			},
		}"
		target="_blank"
		class="flex flex-col gap-y-4 overflow-hidden"
	>
		<div>
			<NuxtImg
				:src="hotel.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
				:alt="hotel.hotel_name"
				class="aspect-square h-full w-full rounded-xl object-cover"
			/>
		</div>
		<div class="flex flex-col gap-y-1">
			<div class="flex flex-col gap-y-0.5">
				<div class="flex items-center justify-between gap-x-1">
					<h4 class="truncate text-base font-semibold">
						{{ hotel.hotel_name }}
					</h4>
					<HotelRating :rating="Number(hotel.rating)" show-text />
				</div>
				<p class="text-muted-foreground">
					{{ hotel.city_name || hotel.country_name }}
				</p>
			</div>

			<div class="flex items-center gap-x-2">
				<p class="font-semibold">{{ hotel.currency }} {{ hotel.avg_price }}</p>
				<p class="text-muted-foreground">for 1 night</p>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute()

defineProps({
	hotel: {
		type: Object,
		required: true,
	},
})
</script>
