<template>
	<Dialog :open="isOpen" @update:open="$emit('update:isOpen')">
		<DialogContent>
			<DialogHeader>
				<slot name="header">
					<DialogTitle>{{ title }}</DialogTitle>
					<DialogDescription v-if="description">
						{{ description }}
					</DialogDescription>
				</slot>
			</DialogHeader>

			<slot name="content">
				<div v-if="$slots.default" class="py-4">
					<slot />
				</div>
			</slot>

			<DialogFooter>
				<slot name="footer">
					<Button
						v-if="showCancel"
						variant="outline"
						@click="$emit('update:isOpen', false)"
					>
						{{ cancelText }}
					</Button>
					<Button
						v-if="showConfirm"
						:variant="confirmVariant"
						@click="$emit('confirm')"
					>
						{{ confirmText }}
					</Button>
				</slot>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup>
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

const props = defineProps({
	isOpen: { type: Boolean, required: true },
	title: { type: String, default: "" },
	description: { type: String, default: "" },
	showCancel: { type: Boolean, default: true },
	showConfirm: { type: Boolean, default: true },
	cancelText: { type: String, default: "Cancel" },
	confirmText: { type: String, default: "Confirm" },
	confirmVariant: { type: String, default: "default" },
})

defineEmits(["update:isOpen", "confirm"])
</script>
