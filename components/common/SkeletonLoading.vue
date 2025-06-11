<template>
	<div class="flex flex-col gap-8">
		<!-- Price Range Filter Skeleton -->
		<div class="space-y-5 rounded-2xl">
			<div class="skeleton-shimmer h-4 w-32 rounded-lg bg-gray-200"></div>
			<div
				class="flex items-center justify-between gap-2 rounded-xl bg-gray-50 p-4"
			>
				<div class="flex w-1/2 items-center gap-2">
					<div class="skeleton-shimmer h-4 w-10 rounded-md bg-gray-200"></div>
					<div class="skeleton-shimmer h-8 w-20 rounded-lg bg-gray-200"></div>
				</div>
				<div class="h-6 w-px bg-gray-200"></div>
				<div class="flex w-1/2 items-center justify-end gap-2">
					<div class="skeleton-shimmer h-4 w-10 rounded-md bg-gray-200"></div>
					<div class="skeleton-shimmer h-8 w-20 rounded-lg bg-gray-200"></div>
				</div>
			</div>
		</div>

		<!-- Amenities Filter Skeleton -->
		<div class="space-y-5 rounded-2xl">
			<div class="skeleton-shimmer h-4 w-24 rounded-lg bg-gray-200"></div>
			<div class="flex flex-wrap gap-3">
				<div
					v-for="n in 6"
					:key="n"
					class="skeleton-shimmer h-6 w-24 rounded-full bg-gray-200"
				></div>
			</div>
		</div>
	</div>
</template>

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
