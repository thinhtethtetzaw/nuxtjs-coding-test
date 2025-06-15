<template>
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium text-gray-900">{{ label }}</span>
		<div class="flex items-center gap-2">
			<button
				type="button"
				:disabled="modelValue <= min"
				@click="decrement"
				class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
			>
				<MinusIcon class="size-3" />
			</button>
			<span class="w-8 text-center text-sm">{{ modelValue }}</span>
			<button
				type="button"
				:disabled="modelValue >= max"
				@click="increment"
				class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
			>
				<PlusIcon class="size-3" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { MinusIcon, PlusIcon } from "lucide-vue-next"

const props = defineProps({
	modelValue: {
		type: Number,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	min: {
		type: Number,
		default: 1,
	},
	max: {
		type: Number,
		default: 10,
	},
})

const emit = defineEmits(["update:modelValue"])

const increment = () => {
	if (props.modelValue < props.max) {
		emit("update:modelValue", props.modelValue + 1)
	}
}

const decrement = () => {
	if (props.modelValue > props.min) {
		emit("update:modelValue", props.modelValue - 1)
	}
}
</script>
