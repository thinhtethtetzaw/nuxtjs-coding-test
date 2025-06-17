<template>
	<div class="rounded-2xl bg-white">
		<div class="flex gap-3">
			<!-- Main Image -->
			<div
				class="group relative aspect-square flex-1 overflow-hidden rounded-xl md:aspect-video"
			>
				<NuxtImg
					:src="images?.[0]?.url || '/placeholder-hotel.jpg'"
					:alt="hotelName"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></div>
			</div>

			<!-- Side Images -->
			<div class="grid flex-1 grid-cols-2 gap-3">
				<!-- First side image -->
				<div
					class="group relative aspect-square overflow-hidden rounded-xl md:aspect-video"
				>
					<NuxtImg
						:src="images?.[1]?.url || '/placeholder-hotel.jpg'"
						:alt="hotelName"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
				</div>

				<!-- Second side image -->
				<div
					class="group relative aspect-square overflow-hidden rounded-xl md:aspect-video"
				>
					<NuxtImg
						:src="images?.[2]?.url || '/placeholder-hotel.jpg'"
						:alt="hotelName"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
				</div>

				<!-- Third side image -->
				<div
					class="group relative aspect-square overflow-hidden rounded-xl md:aspect-video"
				>
					<NuxtImg
						:src="images?.[3]?.url || '/placeholder-hotel.jpg'"
						:alt="hotelName"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
				</div>

				<!-- More Photos Overlay with 5th image background -->
				<div
					class="group relative aspect-square cursor-pointer overflow-hidden rounded-xl md:aspect-video"
					@click="$emit('openGallery')"
				>
					<!-- Background image (5th image) with low opacity -->
					<NuxtImg
						:src="
							images?.[4]?.url || images?.[1]?.url || '/placeholder-hotel.jpg'
						"
						:alt="hotelName"
						class="h-full w-full object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-30"
					/>

					<!-- Elegant overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70 transition-all duration-300 group-hover:from-black/50 group-hover:via-black/70 group-hover:to-black/80"
					>
						<div class="flex h-full items-center justify-center">
							<div
								class="transform text-center text-white transition-transform duration-300 group-hover:scale-105"
							>
								<div class="md:mb-2">
									<span
										class="text-lg font-bold tracking-tight drop-shadow-lg md:text-2xl lg:text-4xl"
									>
										+{{ Math.max(0, (images?.length || 0) - 4) }}
									</span>
								</div>
								<p
									class="hidden text-xs font-semibold tracking-wide uppercase opacity-90 drop-shadow md:block md:text-sm"
								>
									More Photos
								</p>
							</div>
						</div>
					</div>

					<!-- Subtle border on hover -->
					<div
						class="absolute inset-0 rounded-xl border-2 border-white/0 transition-all duration-300 group-hover:border-white/20"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	images: {
		type: Array,
		default: () => [],
	},
	hotelName: {
		type: String,
		default: "",
	},
})

defineEmits(["openGallery"])
</script>
