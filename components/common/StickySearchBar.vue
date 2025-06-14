<template>
	<Transition
		name="sticky-form"
		enter-active-class="transition-all duration-500 ease-out"
		leave-active-class="transition-all duration-300 ease-in"
		enter-from-class="opacity-0 -translate-y-full"
		enter-to-class="opacity-100 translate-y-0"
		leave-from-class="opacity-100 translate-y-0"
		leave-to-class="opacity-0 -translate-y-full"
	>
		<div
			v-if="show"
			class="fixed top-0 right-0 left-0 z-50 mx-auto border-b border-gray-200 bg-white px-20 py-3 shadow-lg"
		>
			<form @submit.prevent="$emit('search-rooms')" class="w-full">
				<div class="flex items-center gap-3">
					<div class="relative w-80 flex-shrink-0">
						<FilterHotelsSearch
							v-model="modelSearchQuery"
							@select="$emit('select-hotel', modelSelectedHotel)"
							:placeholder="
								modelSelectedHotel
									? modelSelectedHotel.hotel_name
									: 'Choose hotel...'
							"
							class="compact"
						/>
					</div>
					<div class="flex-1">
						<FilterRoomSearch
							v-model="modelRoomSearchParams"
							:is-searching="modelIsRoomSearching"
							:is-compact="true"
							@search="$emit('search-hotels')"
						/>
					</div>
				</div>
				<slot />
			</form>
		</div>
	</Transition>
</template>

<script setup>
import { toRefs, computed } from "vue"
import FilterHotelsSearch from "@/components/filter/HotelsSearch.vue"
import FilterRoomSearch from "@/components/filter/RoomSearch.vue"

const props = defineProps({
	show: Boolean,
	modelValue: String, // for v-model:searchQuery
	modelRoomSearchParams: Object, // for v-model:roomSearchParams
	modelIsRoomSearching: Boolean, // for v-model:isRoomSearching
	modelSelectedHotel: Object, // for v-model:selectedHotel
})

const emit = defineEmits([
	"update:modelValue",
	"update:modelRoomSearchParams",
	"update:modelIsRoomSearching",
	"update:modelSelectedHotel",
	"select-hotel",
	"search-hotels",
	"search-rooms",
])

const modelSearchQuery = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
})

const modelRoomSearchParams = computed({
	get: () => props.modelRoomSearchParams,
	set: (val) => emit("update:modelRoomSearchParams", val),
})
</script>
