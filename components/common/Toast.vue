<template>
	<Transition
		name="toast"
		enter-active-class="transition-all duration-300 ease-out"
		leave-active-class="transition-all duration-200 ease-in"
		enter-from-class="opacity-0 translate-y-2"
		enter-to-class="opacity-100 translate-y-0"
		leave-from-class="opacity-100 translate-y-0"
		leave-to-class="opacity-0 translate-y-2"
	>
		<div
			v-if="isVisible"
			class="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 shadow-lg"
		>
			<CheckCircleIcon class="h-5 w-5 text-green-500" />
			<p class="text-sm font-medium text-green-800">{{ message }}</p>
		</div>
	</Transition>
</template>

<script setup>
import { CheckCircleIcon } from "lucide-vue-next"

const props = defineProps({
	isVisible: {
		type: Boolean,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
})
</script>
