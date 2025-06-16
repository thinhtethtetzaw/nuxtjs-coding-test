<template>
	<div class="flex flex-col gap-y-8">
		<!-- Price Range Filter Skeleton -->
		<div class="space-y-5">
			<Skeleton class="h-4 w-32" />

			<div class="grid grid-cols-2 gap-2">
				<Skeleton class="h-12 w-full" />
				<Skeleton class="h-12 w-full" />
			</div>
		</div>

		<!-- Amenities Filter Skeleton -->
		<div class="space-y-5">
			<Skeleton class="h-4 w-32" />

			<div class="flex flex-col gap-2">
				<Skeleton class="h-6 w-full" />
				<Skeleton class="h-6 w-full" />
				<Skeleton class="h-6 w-full" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton"
</script>

<style scoped>
.skeleton-shimmer {
	position: relative;
	overflow: hidden;
}
.skeleton-shimmer::after {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	height: 100%;
	width: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.3),
		transparent
	);
	animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
	100% {
		left: 100%;
	}
}
</style>
