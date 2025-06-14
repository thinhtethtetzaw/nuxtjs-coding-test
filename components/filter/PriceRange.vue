<template>
	<div class="space-y-4">
		<h3 class="font-semibold">Price Range (THB)</h3>
		<div class="space-y-4">
			<div
				class="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-3"
			>
				<div class="flex items-center gap-2">
					<span class="text-gray-500">Min:</span>
					<input
						type="number"
						:value="modelValue.priceMin"
						@input="updatePrice('priceMin', $event.target.value)"
						class="w-24 rounded border border-gray-200 bg-white p-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>
				<div class="h-4 w-px bg-gray-200"></div>
				<div class="flex items-center gap-2">
					<span class="text-gray-500">Max:</span>
					<input
						type="number"
						:value="modelValue.priceMax"
						@input="updatePrice('priceMax', $event.target.value)"
						class="w-24 rounded border border-gray-200 bg-white p-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
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

const emit = defineEmits(["update:modelValue"])

const updatePrice = (field, value) => {
	emit("update:modelValue", {
		...props.modelValue,
		[field]: value ? Number(value) : null,
	})
}
</script>
