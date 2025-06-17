<template>
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
	>
		<div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
			<!-- Error Icon -->
			<div class="mb-6">
				<div
					class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50"
				>
					<AlertTriangleIcon class="size-10 text-red-500" />
				</div>
			</div>

			<!-- Error Title -->
			<h1 class="mb-3 text-4xl font-bold text-gray-800">
				{{ error.statusCode === 404 ? "Page Not Found" : "Oops!" }}
			</h1>

			<!-- Error Code -->
			<div class="mb-4 font-medium text-gray-500">
				Error {{ error.statusCode }}
			</div>

			<!-- Error Message -->
			<p class="mb-8 text-lg text-gray-600">
				{{ error.message || "Something went wrong. Please try again later." }}
			</p>

			<!-- Action Button -->
			<Button @click="handleError">
				<span>{{ error.statusCode === 404 ? "Go Home" : "Try Again" }}</span>
				<HomeIcon class="size-4" />
			</Button>
		</div>
	</div>
</template>

<script setup>
import { AlertTriangleIcon, HomeIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const props = defineProps({
	error: Object,
})

const router = useRouter()

const handleError = () => {
	clearError()
	if (props.error.statusCode === 404) {
		router.push("/")
	} else {
		window.location.reload()
	}
}
</script>
