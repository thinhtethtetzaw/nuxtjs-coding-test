<template>
	<div
		v-if="isLoading && isVisible"
		class="absolute z-10 mt-1 max-h-72 min-h-20 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-4 py-6 text-center text-gray-500 shadow-lg"
	>
		<CommonSpinnerLoading :is-loading="true" />
	</div>

	<div
		v-else-if="isVisible && results.length"
		class="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
	>
		<div
			v-for="result in results"
			:key="result.id || result.slug"
			class="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-blue-50"
			@mousedown.prevent="onSelect(result)"
		>
			<div class="flex-1">
				<div class="font-medium text-gray-900">
					{{ result.hotel_name }}
				</div>
				<div
					v-if="result.city_name || result.country_name"
					class="text-sm text-gray-500"
				>
					{{ result.city_name }} {{ result.country_name }}
				</div>
			</div>
		</div>
	</div>

	<div
		v-else-if="isVisible && searchQuery && !results.length"
		class="absolute z-10 mt-1 max-h-72 min-h-20 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-4 py-6 text-center text-gray-500 shadow-lg"
	>
		No hotels found matching your search.
	</div>
</template>

<script setup>
defineProps({
	results: {
		type: Array,
		required: true,
		default: () => [],
	},
	isVisible: {
		type: Boolean,
		required: true,
		default: false,
	},
	searchQuery: {
		type: String,
		required: true,
		default: "",
	},
	isLoading: {
		type: Boolean,
		required: true,
		default: false,
	},
})

const emit = defineEmits(["select"])

const onSelect = (result) => {
	emit("select", result)
}
</script>
