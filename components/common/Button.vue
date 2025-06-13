<template>
	<button :class="buttonClasses" :disabled="disabled" @click="handleClick">
		<slot />
	</button>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
	variant: {
		type: String,
		default: "primary",
		validator: (value) =>
			["primary", "outline", "ghost", "danger"].includes(value),
	},
	size: {
		type: String,
		default: "md",
		validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	fullWidth: {
		type: Boolean,
		default: false,
	},
	roundedFull: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["click"])

const handleClick = (event) => {
	if (!props.disabled && !props.loading) {
		emit("click", event)
	}
}

const buttonClasses = computed(() => {
	const baseClasses = [
		"inline-flex",
		"items-center",
		"justify-center",
		"rounded-lg",
		"transition-all",
		"duration-200",
		"focus:outline-none",
		"active:scale-95",
	]

	// Size classes
	const sizeClasses = {
		xs: ["px-2", "py-1", "text-xs"],
		sm: ["px-3", "py-1.5", "text-sm"],
		md: ["px-4", "py-2", "text-sm"],
		lg: ["px-6", "py-3", "text-base"],
		xl: ["px-8", "py-4", "text-lg"],
	}

	// Variant classes using primary color scheme
	const variantClasses = {
		primary: [
			"bg-primary",
			"text-white",
			"hover:bg-primary/90",
			"focus:ring-primary",
			"shadow-md",
			"hover:shadow-lg",
		],
		outline: [
			"border-[1.5px]",
			"border-gray-300",
			"text-gray-600",
			"bg-transparent",
			"hover:bg-gray-100",
		],
		ghost: ["text-primary", "bg-transparent", "focus:outline-none", "!p-0"],
		danger: [
			"bg-red-600",
			"text-white",
			"hover:bg-red-700",
			"focus:ring-red-300",
			"shadow-md",
			"hover:shadow-lg",
		],
	}

	// Additional state classes
	const stateClasses = []

	if (props.disabled || props.loading) {
		stateClasses.push("opacity-50", "cursor-not-allowed")
	} else {
		stateClasses.push("cursor-pointer")
	}

	if (props.fullWidth) {
		stateClasses.push("w-full")
	}
	if (props.roundedFull) {
		stateClasses.push("!rounded-full")
	}

	// Combine all classes
	return [
		...baseClasses,
		...sizeClasses[props.size],
		...variantClasses[props.variant],
		...stateClasses,
	].join(" ")
})
</script>
