<template>
	<div class="space-y-2">
		<h3 class="font-semibold">Amenities</h3>
		<div class="flex flex-wrap gap-2">
			<div
				v-for="amenity in amenities"
				:key="amenity.id"
				class="flex items-center"
			>
				<input
					type="checkbox"
					:id="'amenity-' + amenity.id"
					:value="amenity.id"
					:checked="modelValue.includes(amenity.id)"
					@change="updateAmenities(amenity.id)"
					class="peer hidden"
				/>
				<label
					:for="'amenity-' + amenity.id"
					class="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-1 text-sm text-gray-700 transition-all duration-150 select-none peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white hover:border-blue-400 hover:bg-blue-50"
				>
					{{ amenity.name }}
				</label>
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
