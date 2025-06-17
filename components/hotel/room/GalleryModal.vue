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
			class="fixed inset-0 z-50 origin-center transform bg-white px-4 py-10"
		>
			<div class="container mx-auto flex h-full max-w-7xl flex-col">
				<div class="animate-slide-up flex items-center justify-between">
					<div class="text-gray-700">
						<h2 class="text-2xl font-semibold">{{ room.room_type }}</h2>
						<p class="text-gray-500">{{ images?.length || 0 }} Photos</p>
					</div>
					<Button variant="ghost" size="icon" @click="$emit('close')">
						<XIcon class="size-5 text-gray-700" />
					</Button>
				</div>

				<!-- Gallery Content -->
				<div class="scrollbar-hide my-4 flex-1 overflow-auto">
					<div class="mx-auto w-full max-w-4xl">
						<!-- Image Carousel -->
						<div class="relative">
							<div
								class="aspect-video overflow-hidden rounded-xl bg-gray-900 shadow-lg"
							>
								<NuxtImg
									:src="images[currentImageIndex]?.url"
									:alt="`${room.room_type} - Photo ${currentImageIndex + 1}`"
									class="h-full w-full object-cover"
								/>
							</div>

							<!-- Navigation Buttons -->
							<button
								v-if="images.length > 1"
								@click="previousImage"
								class="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
							>
								<ChevronLeftIcon class="size-5 text-gray-700" />
							</button>
							<button
								v-if="images.length > 1"
								@click="nextImage"
								class="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
							>
								<ChevronRightIcon class="size-5 text-gray-700" />
							</button>

							<!-- Image Counter -->
							<div
								class="absolute bottom-4 left-4 rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-700 backdrop-blur-sm"
							>
								{{ currentImageIndex + 1 }} / {{ images?.length }}
							</div>
						</div>

						<!-- Thumbnail Strip -->
						<div
							v-if="images.length > 1"
							class="flex gap-2 overflow-x-auto px-1 py-4"
						>
							<button
								v-for="(image, index) in images"
								:key="index"
								@click="currentImageIndex = index"
								class="flex-shrink-0 overflow-hidden rounded-lg transition-all"
								:class="[
									currentImageIndex === index
										? 'ring-primary ring-2'
										: 'opacity-70 hover:opacity-100',
								]"
							>
								<NuxtImg
									:src="image.url"
									:alt="`Thumbnail ${index + 1}`"
									class="h-16 w-20 object-cover"
								/>
							</button>
						</div>

						<!-- Room Details -->
						<div
							class="animate-slide-up mt-4 space-y-6 rounded-xl bg-white/50 backdrop-blur-sm"
						>
							<div>
								<h3 class="mb-2 text-xl font-semibold text-gray-900">
									Room Details
								</h3>
								<div
									class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2"
								>
									<div class="flex items-center gap-2">
										<UsersIcon class="size-4" />
										<span>Max {{ room.max_occupancy }} guests</span>
									</div>
									<div class="flex items-center gap-2">
										<RulerIcon class="size-4" />
										<span>{{ room.size_measurement || "Spacious room" }}</span>
									</div>
								</div>
							</div>

							<!-- Amenities -->
							<div v-if="room.amenities?.length">
								<h4 class="mb-3 font-semibold text-gray-900">Amenities</h4>
								<div
									class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
								>
									<div
										v-for="amenity in room.amenities"
										:key="amenity.id"
										class="flex items-center gap-2 text-sm text-gray-600"
									>
										<CheckIcon class="text-primary size-3" />
										<span>{{ amenity.amenity_name }}</span>
									</div>
								</div>
							</div>

							<!-- Rate Plans & Inclusions -->
							<div v-if="room.rate_plans?.length">
								<h4 class="mb-3 font-semibold text-gray-900">
									Available Plans & Inclusions
								</h4>
								<div class="space-y-4">
									<div
										v-for="ratePlan in room.rate_plans"
										:key="ratePlan.id"
										class="rounded-lg border border-gray-200 p-4"
									>
										<h5 class="mb-2 font-medium text-gray-900">
											{{ ratePlan.rate_plan_name }}
										</h5>
										<div class="space-y-1">
											<div
												v-if="ratePlan.include_breakfast"
												class="flex items-center gap-2 text-sm text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>Free Breakfast</span>
											</div>
											<div
												v-for="benefit in ratePlan.benefits"
												:key="benefit.id"
												class="flex items-center gap-2 text-sm text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>{{ benefit.hint }}</span>
											</div>
											<div
												v-if="!ratePlan.no_cancel_ind"
												class="flex items-center gap-2 text-sm text-gray-600"
											>
												<CheckIcon class="text-primary size-3" />
												<span>Free Cancellation</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { Button } from "@/components/ui/button"
import {
	XIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	UsersIcon,
	RulerIcon,
	CheckIcon,
} from "lucide-vue-next"

const props = defineProps({
	isOpen: { type: Boolean, required: true },
	images: { type: Array, required: true },
	room: { type: Object, required: true },
})

const currentImageIndex = ref(0)

const nextImage = () => {
	if (currentImageIndex.value < props.images.length - 1) {
		currentImageIndex.value++
	} else {
		currentImageIndex.value = 0
	}
}

const previousImage = () => {
	if (currentImageIndex.value > 0) {
		currentImageIndex.value--
	} else {
		currentImageIndex.value = props.images.length - 1
	}
}

// Reset to first image when modal opens
watch(
	() => props.isOpen,
	(newVal) => {
		if (newVal) {
			currentImageIndex.value = 0
		}
	},
)
</script>

<style scoped>
@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(1.25rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-slide-up {
	animation: slide-up 0.6s ease-out forwards;
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
