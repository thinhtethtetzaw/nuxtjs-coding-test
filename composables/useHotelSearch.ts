import { ref } from "vue"
import type { THotelSearch } from "~/types"

/**
 * Custom composable to perform hotel search via /api/hotels/search
 * @returns {Object} - { data, error, loading, executeSearch }
 */
export function useHotelSearch() {
	const data = ref<THotelSearch | null>(null)
	const error = ref<any>(null)
	const loading = ref(false)

	const executeSearch = async (body?: Record<string, any>) => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch<THotelSearch>("/api/hotels/search", {
				method: "POST",
				body,
			})
			data.value = response
		} catch (err) {
			error.value = err
		} finally {
			loading.value = false
		}
	}

	return { data, error, loading, executeSearch }
}
