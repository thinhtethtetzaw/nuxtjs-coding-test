<template>
	<div class="cursor-pointer" @click="$emit('open-gallery')">
		<!-- Main large image -->
		<div class="mb-2">
			<NuxtImg
				:src="images?.[0]?.url || '/placeholder-room.jpg'"
				:alt="roomName"
				class="aspect-video w-full rounded-lg object-cover"
			/>
		</div>

		<div v-if="images && images.length > 1" class="grid grid-cols-2 gap-2">
			<NuxtImg
				:src="images[1]?.url"
				:alt="`${roomName} - Image 2`"
				class="aspect-video w-full rounded-lg object-cover"
			/>

			<div class="relative">
				<NuxtImg
					:src="images[2]?.url || images[1]?.url"
					:alt="`${roomName} - Image 3`"
					class="aspect-video w-full rounded-lg object-cover"
				/>
				<div
					v-if="images.length > 3"
					class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"
				>
					<span class="text-lg font-semibold text-white">
						+{{ images.length - 3 }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	images: { type: Array, required: true },
	roomName: { type: String, required: true },
})
</script>
