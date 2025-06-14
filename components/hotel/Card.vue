<template>
	<div
		class="mb-2 flex flex-col overflow-hidden rounded-2xl border border-gray-200 transition-all duration-200"
	>
		<img
			:src="hotel.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
			:alt="hotel.hotel_name"
			class="h-52 w-full object-cover"
		/>

		<div class="flex flex-col gap-2 p-4">
			<p class="text-primary">
				{{ hotel.address?.[0]?.cityName || hotel.address?.[0]?.countryName }}
			</p>
			<h2 class="mb-2 text-xl font-semibold text-gray-700">
				{{ hotel.hotel_name }}
			</h2>
			<div class="mt-4 flex items-center justify-between gap-2 text-gray-700">
				<span class="text-gray-700"> Avg. Price: ${{ hotel.avg_price }} </span>
				<span class="mx-2 text-gray-300">|</span>
				<div class="flex items-center gap-1">
					<div class="flex items-center gap-1">
						<div v-for="n in 5" :key="'star-' + n">
							<StarIcon
								v-if="n <= Math.floor(Number(hotel.rating))"
								class="size-4 fill-yellow-400 text-yellow-400"
							/>
							<StarHalfIcon
								v-else-if="
									n === Math.ceil(Number(hotel.rating)) &&
									Number(hotel.rating) % 1 >= 0.5
								"
								class="h-5 w-5 fill-yellow-400 text-yellow-400"
							/>
							<StarIcon v-else class="h-5 w-5 text-gray-300" />
						</div>
					</div>
					<span class="ml-1 text-gray-700">{{ hotel.rating }}</span>
				</div>
			</div>
			<button
				@click="navigateTo(`/hotels/${hotel.slug}`)"
				class="bg-primary mt-2 cursor-pointer rounded-full px-4 py-2 text-white transition-all duration-200 hover:scale-105"
			>
				View Details
			</button>
		</div>
	</div>
</template>

<script setup>
import { StarIcon, StarHalfIcon } from "lucide-vue-next"
const props = defineProps({
	hotel: {
		type: Object,
		required: true,
	},
})
</script>
