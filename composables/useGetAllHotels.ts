import { ref } from "vue"

/**
 * Custom composable to fetch all hotels via /api/hotels
 * @returns {Object} - { data, error, loading, getAllHotels }
 */
export function useGetAllHotels() {
	const data = ref<any>(null)
	const error = ref<any>(null)
	const loading = ref(false)

	const getAllHotels = async () => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch("/api/hotels", {
				method: "POST",
			})
			data.value = response
		} catch (err) {
			error.value = err
		} finally {
			loading.value = false
		}
	}

	return { data, error, loading, getAllHotels }
}
