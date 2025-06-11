import defu from "defu"

/**
 * Custom hook to fetch data from the API using custom api instance.
 * @param url - The URL to fetch data from.
 * @param options - `useFetch` options.
 * @returns - `useFetch` hook.
 */
export const useApi: typeof useFetch = (url, options) => {
	const method = String(options?.method ?? "get").toLowerCase()
	const notGetRequest = method !== "get"
	const isImmediateDisabled = notGetRequest && !options?.immediate
	const isWatchDisabled = notGetRequest && !options?.watch

	const key = computed(() => `${method}:${url}`)

	const opts = defu(options, {
		key: key.value,
		$fetch: useNuxtApp().$api,
		method: options?.method ?? "get",
		immediate: isImmediateDisabled ? false : options?.immediate,
		watch: isWatchDisabled ? false : options?.watch,
	}) as typeof options

	return useFetch(url, opts)
}

/**
 * Custom hook to fetch data lazily from the API using custom api instance.
 * @param url - The URL to fetch data from.
 * @param options - `useFetch` options.
 * @param body - The payload body for POST/PUT/PATCH requests.
 * @returns - `useFetch` hook.
 */
export const useLazyApi: typeof useFetch = (url, options, body?: any) => {
	const method = String(options?.method ?? "get").toLowerCase()
	const notGetRequest = method !== "get"
	const isImmediateDisabled = notGetRequest && !options?.immediate
	const isWatchDisabled = notGetRequest && !options?.watch

	const key = computed(() => `${method}:${url}`)

	const opts = defu(options, {
		key: key.value,
		lazy: true,
		$fetch: useNuxtApp().$api,
		method: options?.method ?? "get",
		body: body,
		immediate: isImmediateDisabled ? false : options?.immediate,
		watch: isWatchDisabled ? false : options?.watch,
	}) as typeof options

	return useFetch(url, opts)
}
