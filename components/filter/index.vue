<template>
	<div class="sticky top-24 hidden lg:block xl:top-32">
		<div v-if="isHotelsLoading">
			<CommonFilterSkeletonLoading />
		</div>
		<div v-else class="flex flex-col gap-y-8">
			<FilterPriceRange
				:model-value="filters"
				@update:model-value="updateFilters"
			/>
			<FilterAmenities
				:model-value="filters.selectedAmenities"
				@update:model-value="updateSelectedAmenities"
				:amenities="availableAmenities"
			/>
		</div>
	</div>

	<div class="flex justify-end lg:hidden">
		<Drawer>
			<DrawerTrigger v-if="!isHotelsLoading">
				<Button
					variant="outline"
					class="md:border-input border-transparent shadow-none md:shadow-xs"
				>
					<SlidersHorizontalIcon class="size-4" />
					<span class="hidden md:block">Filters</span>
				</Button>
			</DrawerTrigger>
			<Skeleton v-else class="h-9 w-[42px] md:w-20" />
			<DrawerContent>
				<div class="scrollbar-hide mx-auto max-w-md overflow-auto py-4">
					<div v-if="isHotelsLoading">
						<CommonFilterSkeletonLoading />
					</div>
					<div v-else class="flex flex-col gap-y-8">
						<FilterPriceRange
							:model-value="filters"
							@update:model-value="updateFilters"
						/>
						<FilterAmenities
							:model-value="filters.selectedAmenities"
							@update:model-value="updateSelectedAmenities"
							:amenities="availableAmenities"
						/>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	</div>
</template>

<script setup lang="ts">
import { SlidersHorizontalIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

const props = defineProps<{
	isHotelsLoading: boolean
	filters: {
		priceMin: number | null
		priceMax: number | null
		selectedAmenities: any[]
	}
	availableAmenities: Array<{
		id: string | number
		name: string
		count: number
	}>
}>()

// Define emits
const emit = defineEmits<{
	"update:filters": [value: typeof props.filters]
}>()

// Update handlers
const updateFilters = (newFilters: typeof props.filters) => {
	emit("update:filters", newFilters)
}

const updateSelectedAmenities = (newAmenities: any[]) => {
	emit("update:filters", {
		...props.filters,
		selectedAmenities: newAmenities,
	})
}
</script>
