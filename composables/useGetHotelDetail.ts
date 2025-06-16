import { ref } from "vue"

/**
 * Custom composable to fetch hotel detail by slug via /api/hotels/{slug}
 * @returns {Object} - { data, error, loading, getHotelDetail }
 */
export function useGetHotelDetail() {
	const data = ref<any>(null)
	const error = ref<any>(null)
	const loading = ref(false)

	const getHotelDetail = async (slug: string) => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch(`/api/hotels/${slug}`, {
				method: "POST",
			})
			data.value = response
		} catch (err) {
			error.value = err
		} finally {
			loading.value = false
		}
	}

	return { data, error, loading, getHotelDetail }
}
