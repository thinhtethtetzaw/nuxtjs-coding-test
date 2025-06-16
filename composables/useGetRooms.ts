import { ref } from "vue"

/**
 * Custom composable to fetch hotel rooms by slug and params via /api/hotels/{slug}/rooms
 * @returns {Object} - { data, error, loading, getRooms }
 */
export function useGetRooms() {
	const data = ref<any>(null)
	const error = ref<any>(null)
	const loading = ref(false)

	const getRooms = async (slug: string, params: Record<string, any>) => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch(`/api/hotels/${slug}/rooms`, {
				method: "POST",
				body: params,
			})
			data.value = response
		} catch (err) {
			error.value = err
		} finally {
			loading.value = false
		}
	}

	return { data, error, loading, getRooms }
}
