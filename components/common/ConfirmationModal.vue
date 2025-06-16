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
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all"
			>
				<!-- Header -->
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<h3 class="text-lg font-semibold text-gray-900">
							{{ title }}
						</h3>
					</div>
					<button
						@click="$emit('close')"
						class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<XIcon class="h-5 w-5" />
					</button>
				</div>

				<!-- Content -->
				<p class="mb-4 text-sm text-gray-700">
					{{ description }}
				</p>

				<!-- Footer -->
				<div class="flex gap-3">
					<CommonButton
						@click="$emit('close')"
						variant="outline"
						class="flex-1"
					>
						{{ cancelButtonText }}
					</CommonButton>
					<CommonButton @click="handleConfirm" class="flex-1">
						{{ confirmButtonText }}
					</CommonButton>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { XIcon } from "lucide-vue-next"

const props = defineProps({
	isOpen: { type: Boolean, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	cancelButtonText: { type: String, default: "Cancel" },
	confirmButtonText: { type: String, default: "Confirm" },
})

const emit = defineEmits(["close", "confirm"])

const handleConfirm = () => {
	emit("confirm")
}
</script>
