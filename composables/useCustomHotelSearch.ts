import { readonly, ref } from "vue"

/**
 * Custom composable to perform a custom hotel search via /api/hotels/custom-search
 * @param {any} initialData - Optional initial data for SSR hydration
 * @returns {Object} - { data, error, loading, searchHotels }
 */
export function useCustomHotelSearch(initialData: any = null) {
	const data = ref<any>(initialData)
	const error = ref<any>(null)
	const loading = ref(false)

	const searchHotels = async (search: string | null) => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch("/api/hotels/custom-search", {
				method: "POST",
				body: { search },
			})
			data.value = response
		} catch (err) {
			error.value = err
		} finally {
			loading.value = false
		}
	}

	return {
		data: readonly(data),
		error: readonly(error),
		loading: readonly(loading),
		searchHotels,
	}
}
