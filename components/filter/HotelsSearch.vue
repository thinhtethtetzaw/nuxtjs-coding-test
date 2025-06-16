<template>
	<div class="w-full py-2" @blur="onSearchBlur">
		<div class="relative w-full max-w-sm items-center">
			<Input
				v-model="search"
				type="text"
				placeholder="Search destinations"
				@input="onInputChange"
				@keydown.enter.prevent="onSearchSubmit"
				class="pl-8"
			/>
			<span
				class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
			>
				<SearchIcon class="text-muted-foreground size-5" />
			</span>
		</div>

		<div
			v-if="isLoading && isResultsVisible"
			class="absolute z-10 mt-1 max-h-72 min-h-20 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-4 py-6 text-center text-gray-500 shadow-lg"
		>
			<CommonSpinnerLoading :is-loading="true" />
		</div>

		<div
			v-else-if="isResultsVisible && searchResults?.data?.length"
			class="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
		>
			<div
				v-for="result in searchResults?.data"
				:key="result.id || result.slug"
				class="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-blue-50"
				@click="onSelect(result)"
			>
				<div class="flex-1">
					<div class="font-medium text-gray-900">
						{{ result.hotel_name }}
					</div>
					<div
						v-if="result.city_name || result.country_name"
						class="text-gray-500"
					>
						{{ result.city_name }} {{ result.country_name }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SearchIcon } from "lucide-vue-next"
import { useUrlParams } from "~/composables/useUrlParams"
import { useDebounceFn } from "@vueuse/core"
import type { THotelSearch } from "~/types"

const route = useRoute()
const router = useRouter()

const { getParam, setParam } = useUrlParams<{ search: string | null }>({
	search: null,
})
const isResultsVisible = ref(false)
const search = ref(getParam("search") || "")

// Watch for URL parameter changes
watch(
	() => getParam("search"),
	(newVal) => {
		search.value = newVal || ""
	},
)

const searchBody = computed(() => {
	const search = getParam("search")
	return search?.trim() ? { search: search.trim() } : undefined
})

const {
	data: searchResults,
	execute,
	pending: isLoading,
} = useFetch<THotelSearch>("/api/hotels/search", {
	method: "POST",
	body: searchBody,
	lazy: true,
	immediate: false,
})

console.log("searchResultsData", searchResults.value?.data)

const debouncedExecute = useDebounceFn(() => {
	execute()
	isResultsVisible.value = true
}, 1000)

const onInputChange = (e: Event) => {
	const target = e.target as HTMLInputElement
	search.value = target.value
	setParam("search", target.value)
	debouncedExecute()
}

const onSearchSubmit = () => {
	execute()
	isResultsVisible.value = true
}

const onSelect = (result: any) => {
	router.push({
		path: `/hotels/${result?.slug}`,
		query: { ...route.query, search: result?.hotel_name },
	})
}

const onSearchBlur = () => {
	isResultsVisible.value = false
}
</script>
