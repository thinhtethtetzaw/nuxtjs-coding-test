/**
 * Custom composable to fetch all hotels via /api/hotels with SSR support
 * @returns {Object} - { data, error, loading, getAllHotels, refresh }
 */
export function useGetAllHotels() {
	const {
		data,
		error,
		pending: loading,
		refresh,
		execute,
	} = useFetch("/api/hotels", {
		method: "POST",
		lazy: true,
		default: () => null,
		transform: (response: any) => response,
	})

	// Wrapper function to maintain backward compatibility
	const getAllHotels = async () => {
		await execute()
	}

	return {
		data: readonly(data),
		error: readonly(error),
		loading: readonly(loading),
		getAllHotels,
		refresh, // Additional method for manual refresh
	}
}
