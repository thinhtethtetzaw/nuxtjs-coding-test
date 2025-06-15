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
			<div class="flex items-center gap-3">
				<div class="relative w-80 flex-shrink-0">
					<FilterHotelsSearch />
				</div>
				<div class="flex-1">
					<FilterRoomSearch :is-compact="true" @search-hotels="searchHotels" />
				</div>
			</div>
			<slot />
		</div>
	</Transition>
</template>

<script setup>
const props = defineProps({
	show: Boolean,
})

const emit = defineEmits(["search-hotels"])

const searchHotels = () => {
	emit("search-hotels")
}
</script>
