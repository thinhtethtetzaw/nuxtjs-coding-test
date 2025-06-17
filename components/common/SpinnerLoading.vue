<template>
	<div v-if="isLoading" class="flex items-center justify-center">
		<LoaderCircle class="text-primary size-8 animate-spin" />
	</div>
</template>

<script setup>
import { LoaderCircle } from "lucide-vue-next"

defineProps({
	isLoading: {
		type: Boolean,
		required: true,
	},
})
</script>
