<template>
	<div v-if="isLoading" class="flex items-center justify-center">
		<div
			:class="`animate-spin rounded-full border-b-2 border-blue-500 size-${size}`"
		></div>
	</div>
</template>

<script setup>
defineProps({
	isLoading: {
		type: Boolean,
		required: true,
	},
	size: {
		type: String,
		default: "8",
	},
})
</script>
