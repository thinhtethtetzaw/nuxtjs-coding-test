<template>
	<div class="w-full">
		<input
			:value="modelValue"
			type="text"
			placeholder="Search hotels..."
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
			@input="onInputChange"
			@keydown.enter.prevent="onSearchSubmit"
			@focus="onInputFocus"
			@blur="onInputBlur"
		/>

		<FilterHotelsResults
			:results="state.searchResults"
			:is-visible="isResultsVisible"
			:search-query="state.searchQuery"
			@select="onResultSelect"
			:is-loading="state.isLoading"
		/>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:modelValue", "select", "search"])

const state = reactive({
	searchResults: [],
	isLoading: false,
	isInputFocused: false,
	searchQuery: "",
})

let searchDebounceTimer = null
let hasUserTyped = false

const { data, execute } = useLazyApi(
	"/api/hotels/search",
	{
		method: "POST",
	},
	computed(() => ({ search: state.searchQuery })),
)

const onInputChange = (event) => {
	hasUserTyped = true
	emit("update:modelValue", event.target.value)
}

const onInputFocus = () => {
	state.isInputFocused = true
}

const onInputBlur = () => {
	setTimeout(() => {
		state.isInputFocused = false
	}, 200)
}

const onResultSelect = (result) => {
	emit("select", result)
	state.isInputFocused = false
	state.searchResults = []
	hasUserTyped = false
}

const onSearchSubmit = () => {
	emit("search", state.searchResults)
}

const fetchSearchResults = async (query) => {
	if (!query.trim()) {
		state.searchResults = []
		state.isInputFocused = false
		return
	}
	state.isLoading = true
	try {
		state.searchQuery = query
		await execute()
		state.searchResults = data.value?.data || []
		state.isInputFocused = true
	} catch (error) {
		state.searchResults = []
		state.isInputFocused = true
	}
	state.isLoading = false
}

watch(
	() => props.modelValue,
	(newValue) => {
		if (!hasUserTyped) return
		if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
		searchDebounceTimer = setTimeout(() => {
			fetchSearchResults(newValue)
		}, 300)
	},
)

const isResultsVisible = computed(() => {
	return state.isInputFocused && state.searchResults.length > 0
})
</script>
