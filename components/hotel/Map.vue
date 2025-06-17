<template>
	<div
		v-if="latitude && longitude"
		class="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200"
	>
		<!-- Google Maps Embed -->
		<iframe
			:src="`https://maps.google.com/maps?q=${latitude},${longitude}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=16&ie=UTF8&iwloc=&output=embed`"
			class="relative z-10 h-full w-full rounded-xl border-0"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			style="filter: contrast(1.1) saturate(1.2)"
			@load="mapLoaded = true"
		>
		</iframe>

		<!-- Map Type Toggle -->
		<div class="absolute bottom-6 left-4 z-40">
			<button
				@click="toggleMapType"
				class="rounded-lg border border-gray-200/50 bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
			>
				{{ mapType === "roadmap" ? "Satellite" : "Map" }}
			</button>
		</div>

		<!-- Loading State -->
		<div
			v-if="!mapLoaded"
			class="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100"
		>
			<CommonSpinnerLoading :is-loading="true" />
		</div>
	</div>
	<div v-else class="flex h-96 items-center justify-center text-gray-500">
		Location not available
	</div>
</template>

<script setup>
import { PlusIcon, MinusIcon } from "lucide-vue-next"
const props = defineProps({
	latitude: {
		type: [String, Number],
		required: true,
	},
	longitude: {
		type: [String, Number],
		required: true,
	},
})

const mapLoaded = ref(false)
const mapType = ref("roadmap")

const toggleMapType = () => {
	mapType.value = mapType.value === "roadmap" ? "satellite" : "roadmap"
}
</script>
