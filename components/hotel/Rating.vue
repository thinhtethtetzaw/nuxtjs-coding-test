<template>
	<div v-if="!showText" class="flex items-center gap-x-1">
		<template v-for="i in 5" :key="i">
			<StarIcon
				v-if="i <= Math.floor(Number(rating))"
				class="size-4 fill-yellow-400 text-yellow-400"
			/>
			<StarHalfIcon
				v-else-if="i === Math.ceil(Number(rating)) && Number(rating) % 1 >= 0.5"
				class="h-5 w-5 fill-yellow-400 text-yellow-400"
			/>
			<StarIcon v-else class="h-5 w-5 text-gray-300" />
		</template>
	</div>
	<div v-else class="flex items-center gap-x-1">
		<StarIcon class="size-4 fill-yellow-400 text-yellow-400" />
		<p>{{ rating }}</p>
	</div>
</template>

<script setup lang="ts">
import { StarIcon, StarHalfIcon } from "lucide-vue-next"

defineProps({
	rating: {
		type: Number,
		required: true,
	},
	showText: {
		type: Boolean,
		default: false,
	},
})
</script>
