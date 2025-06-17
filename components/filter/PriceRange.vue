<template>
	<div class="space-y-4">
		<h3 class="text-base font-semibold">Price Range</h3>
		<div class="space-y-4">
			<!-- Range Display -->
			<div class="flex items-center justify-between text-sm text-gray-600">
				<span>{{
					formatPrice(localValue.priceMin || defaultRange.minPrice)
				}}</span>
				<span>{{
					formatPrice(localValue.priceMax || defaultRange.maxPrice)
				}}</span>
			</div>

			<!-- Range Slider Container -->
			<div class="relative">
				<!-- Track -->
				<div class="relative h-2 rounded-full bg-gray-200">
					<!-- Active Range -->
					<div
						class="bg-primary absolute h-2 rounded-full"
						:style="activeRangeStyle"
					></div>
				</div>

				<!-- Range Inputs -->
				<input
					type="range"
					:min="defaultRange.minPrice"
					:max="defaultRange.maxPrice"
					:step="defaultRange.step"
					:value="localValue.priceMin || defaultRange.minPrice"
					@input="updatePrice('priceMin', $event.target.value)"
					class="range-input absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
				/>
				<input
					type="range"
					:min="defaultRange.minPrice"
					:max="defaultRange.maxPrice"
					:step="defaultRange.step"
					:value="localValue.priceMax || defaultRange.maxPrice"
					@input="updatePrice('priceMax', $event.target.value)"
					class="range-input absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
				/>
			</div>

			<!-- Manual Input Option -->
			<div class="flex items-center justify-between gap-2 pt-2">
				<input
					type="number"
					:min="defaultRange.minPrice"
					:max="defaultRange.maxPrice"
					:step="defaultRange.step"
					:value="localValue.priceMin"
					@input="updatePrice('priceMin', $event.target.value)"
					class="w-32 rounded border border-gray-200 bg-white p-1 py-2 text-center text-sm focus:border-blue-500 focus:outline-none xl:w-40"
					placeholder="Min"
				/>
				<span class="text-gray-900">-</span>
				<input
					type="number"
					:min="defaultRange.minPrice"
					:max="defaultRange.maxPrice"
					:step="defaultRange.step"
					:value="localValue.priceMax"
					@input="updatePrice('priceMax', $event.target.value)"
					class="w-32 rounded border border-gray-200 bg-white p-1 py-2 text-center text-sm focus:border-blue-500 focus:outline-none xl:w-40"
					placeholder="Max"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch } from "vue"

const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
		default: () => ({
			priceMin: null,
			priceMax: null,
		}),
	},
})

const defaultRange = {
	minPrice: 0,
	maxPrice: 10000,
	step: 100,
}

let debounceTimer = null

const emit = defineEmits(["update:modelValue"])

const localValue = ref({ ...props.modelValue })

// Debounced emit function
const debouncedEmit = (newValue) => {
	if (debounceTimer) {
		clearTimeout(debounceTimer)
	}

	debounceTimer = setTimeout(() => {
		emit("update:modelValue", newValue)
	}, 300) // 300ms delay
}

const updatePrice = (field, value) => {
	const numValue = value ? Number(value) : null
	let newValue = { ...localValue.value }

	if (field === "priceMin") {
		newValue.priceMin = numValue
		// Ensure min doesn't exceed max
		if (newValue.priceMax && numValue && numValue > newValue.priceMax) {
			newValue.priceMax = numValue
		}
	} else {
		newValue.priceMax = numValue
		// Ensure max doesn't go below min
		if (newValue.priceMin && numValue && numValue < newValue.priceMin) {
			newValue.priceMin = numValue
		}
	}

	// Update local state immediately for responsive UI
	localValue.value = newValue

	// Emit with debounce
	debouncedEmit(newValue)
}

const formatPrice = (price) => {
	return price ? price.toLocaleString() : "0"
}

const activeRangeStyle = computed(() => {
	const min = localValue.value.priceMin || defaultRange.minPrice
	const max = localValue.value.priceMax || defaultRange.maxPrice
	const range = defaultRange.maxPrice - defaultRange.minPrice

	const leftPercent = ((min - defaultRange.minPrice) / range) * 100
	const rightPercent = ((defaultRange.maxPrice - max) / range) * 100

	return {
		left: `${leftPercent}%`,
		right: `${rightPercent}%`,
	}
})

// Watch for external prop changes and update local state
watch(
	() => props.modelValue,
	(newValue) => {
		localValue.value = { ...newValue }
	},
	{ deep: true },
)
</script>

<style scoped>
.range-input {
	pointer-events: none;
}

.range-input::-webkit-slider-thumb {
	appearance: none;
	height: 18px;
	width: 18px;
	border-radius: 50%;
	background: #2e6171;
	border: 2px solid white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	pointer-events: all;
	position: relative;
	z-index: 1;
}

.range-input::-moz-range-thumb {
	height: 18px;
	width: 18px;
	border-radius: 50%;
	background: #2e6171;
	border: 2px solid white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	pointer-events: all;
}

.range-input::-webkit-slider-track {
	background: transparent;
}

.range-input::-moz-range-track {
	background: transparent;
	border: none;
}

.range-input:focus {
	outline: none;
}

.range-input:focus::-webkit-slider-thumb {
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
