<template>
	<div class="flex flex-col gap-y-6">
		<h3 class="text-base font-semibold">Popular Amenities</h3>
		<div class="flex flex-col gap-3">
			<div v-for="amenity in amenities" :key="amenity.id">
				<div class="flex items-center justify-between gap-x-1">
					<div class="flex items-center gap-x-2">
						<ui-checkbox
							:id="'amenity-' + amenity.id"
							:model-value="modelValue.includes(amenity.id)"
							:value="amenity.id"
							:checked="modelValue.includes(amenity.id)"
							@update:model-value="updateAmenities(amenity.id)"
						/>
						<label
							:for="'amenity-' + amenity.id"
							class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{{ amenity.name }}
						</label>
					</div>
					<p class="text-muted-foreground text-xs">({{ amenity.count }})</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: Array,
		required: true,
		default: () => [],
	},
	amenities: {
		type: Array,
		required: true,
		default: () => [],
	},
})

const emit = defineEmits(["update:modelValue"])

const updateAmenities = (amenityId) => {
	const newValue = props.modelValue.includes(amenityId)
		? props.modelValue.filter((id) => id !== amenityId)
		: [...props.modelValue, amenityId]

	emit("update:modelValue", newValue)
}
</script>
