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
			:is-visible="state.isResultsVisible"
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
	isResultsVisible: false,
	searchQuery: "",
})

let searchDebounceTimer = null

const { data, execute } = useLazyApi(
	"/api/hotels/search",
	{
		method: "POST",
	},
	computed(() => ({ search: state.searchQuery })),
)

const onInputChange = (event) => {
	emit("update:modelValue", event.target.value)
}

const onInputFocus = () => {
	if (state.searchResults.length > 0) state.isResultsVisible = true
}

const onInputBlur = () => {
	setTimeout(() => {
		state.isResultsVisible = false
	}, 200)
}

const onResultSelect = (result) => {
	emit("select", result)
	state.isResultsVisible = false
}

const onSearchSubmit = () => {
	emit("search", state.searchResults)
}

const fetchSearchResults = async (query) => {
	if (!query.trim()) {
		state.searchResults = []
		state.isResultsVisible = false
		return
	}
	state.isLoading = true
	try {
		state.searchQuery = query
		await execute()
		state.searchResults = data.value?.data || []
		state.isResultsVisible = true
	} catch (error) {
		state.searchResults = []
		state.isResultsVisible = true
	}
	state.isLoading = false
}

watch(
	() => props.modelValue,
	(newValue) => {
		if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
		searchDebounceTimer = setTimeout(() => {
			fetchSearchResults(newValue)
		}, 300)
	},
)
</script>
