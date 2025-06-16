<template>
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
		<div class="relative flex border-b-2 border-gray-200">
			<Button
				v-for="tab in tabs"
				:key="tab.key"
				variant="ghost"
				@click="$emit('update:activeTab', tab.key)"
				:class="[
					activeTab === tab.key
						? 'border-primary relative -mb-0.5 bg-blue-50'
						: 'hover:border-primary hover:!text-primary -mb-0.5 border-transparent !text-gray-600 hover:!bg-gray-50',
					'rounded-none border-b-2 px-6 py-3 font-semibold transition-all duration-200',
				]"
			>
				{{ tab.label }}
			</Button>
		</div>
		<div class="p-6">
			<slot :active-tab="activeTab" />
		</div>
	</div>
</template>

<script setup>
import { Button } from "@/components/ui/button"
defineProps({
	tabs: {
		type: Array,
		required: true,
	},
	activeTab: {
		type: String,
		required: true,
	},
})
defineEmits(["update:activeTab"])
</script>
