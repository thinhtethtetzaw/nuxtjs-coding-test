<template>
	<div class="flex flex-col gap-y-4">
		<Skeleton class="aspect-square w-full" />
		<div class="flex flex-col gap-y-1">
			<Skeleton class="h-4 w-2/3" />
			<Skeleton class="h-4 w-1/2" />
			<Skeleton class="h-4 w-2/3" />
		</div>
	</div>
</template>

<script setup>
import { Skeleton } from "@/components/ui/skeleton"
</script>
