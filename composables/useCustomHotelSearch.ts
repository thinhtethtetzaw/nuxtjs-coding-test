/**
 * Custom composable to perform a custom hotel search via /api/hotels/custom-search
 * @param {string|null} search - The search query string
 * @returns {Object} - { data, error, loading, searchHotels }
 */
export function useCustomHotelSearch() {
	const data = ref<any>(null)
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

	return { data, error, loading, searchHotels }
}
