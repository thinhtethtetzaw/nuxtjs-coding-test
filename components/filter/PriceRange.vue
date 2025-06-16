<template>
	<div class="space-y-4">
		<h3 class="text-base font-semibold">Price Range (THB)</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between gap-2">
				<div class="flex flex-col items-center gap-2">
					<span>Minimum</span>
					<input
						type="number"
						:value="modelValue.priceMin"
						@input="updatePrice('priceMin', $event.target.value)"
						class="w-full rounded border border-gray-200 bg-white p-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>
				<MinusIcon class="mt-6 size-4" />
				<div class="flex flex-col items-center gap-2">
					<span>Maximum</span>
					<input
						type="number"
						:value="modelValue.priceMax"
						@input="updatePrice('priceMax', $event.target.value)"
						class="w-full rounded border border-gray-200 bg-white p-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { MinusIcon } from "lucide-vue-next"

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
