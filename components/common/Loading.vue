<template>
	<div v-if="isLoading" class="flex items-center justify-center">
		<div
			class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"
		></div>
	</div>
</template>

<script setup>
defineProps({
	isLoading: {
		type: Boolean,
		required: true,
	},
})
</script>
