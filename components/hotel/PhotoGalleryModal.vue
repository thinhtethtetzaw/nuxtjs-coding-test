<template>
	<Transition
		name="modal"
		enter-active-class="transition-all duration-300 ease-out"
		leave-active-class="transition-all duration-200 ease-in"
		enter-from-class="opacity-0 scale-95"
		enter-to-class="opacity-100 scale-100"
		leave-from-class="opacity-100 scale-100"
		leave-to-class="opacity-0 scale-95"
	>
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 origin-center transform bg-white/90 px-20 py-10 backdrop-blur-sm"
		>
			<div class="flex h-full flex-col">
				<div class="animate-slide-up flex items-center justify-between">
					<div class="text-gray-700">
						<h2 class="text-2xl font-semibold">{{ hotelName }}</h2>
						<p class="text-gray-500">{{ images?.length || 0 }} Photos</p>
					</div>
					<CommonButton variant="ghost" @click="$emit('close')" class="!p-0">
						<XIcon class="size-5 text-gray-700" />
					</CommonButton>
				</div>

				<!-- Gallery Content -->
				<div class="scrollbar-hide my-4 flex-1 overflow-auto">
					<div class="mx-auto w-full">
						<!-- Gallery Grid -->
						<div
							class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						>
							<div
								v-for="(image, index) in images"
								:key="index"
								class="group animate-slide-up relative aspect-square overflow-hidden rounded-xl bg-gray-900 opacity-0 shadow-lg transition-all duration-300 hover:scale-105"
								:style="{ 'animation-delay': `${index * 50}ms` }"
							>
								<img
									:src="image.url"
									:alt="`${hotelName} - Photo ${index + 1}`"
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
								/>
								<!-- Hover Overlay -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								></div>
								<!-- Photo Number -->
								<div
									class="absolute bottom-3 left-3 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm"
								>
									{{ index + 1 }} / {{ images?.length }}
								</div>
							</div>
						</div>

						<!-- Empty State -->
						<div
							v-if="!images?.length"
							class="flex h-64 items-center justify-center"
						>
							<div class="flex flex-col items-center text-center text-gray-700">
								<div class="mb-4 rounded-full bg-gray-200 p-4">
									<HotelIcon color="gray" :size="32" />
								</div>
								<p class="text-lg font-medium">No photos available</p>
								<p class="text-gray-600">
									Photos will appear here when available
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { XIcon, HotelIcon } from "lucide-vue-next"

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
	images: {
		type: Array,
		default: () => [],
	},
	hotelName: {
		type: String,
		default: "",
	},
})
</script>

<style scoped>
/* Custom animations that complement Tailwind */
@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(1.25rem); /* 20px */
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-slide-up {
	animation: slide-up 0.6s ease-out forwards;
}
</style>
