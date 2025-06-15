import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

type QueryParams = Record<string, string | number | boolean | null | undefined>

export function useUrlParams<T extends QueryParams>(initialParams: T) {
	const route = useRoute()
	const router = useRouter()

	// Create a reactive object for all parameters
	const params = ref<T>({
		...initialParams,
		...route.query,
	} as T)

	// Watch for changes in params and update URL
	watch(
		params,
		(newParams) => {
			const query: Record<string, string> = {}

			// Only add non-null and non-undefined values to URL
			Object.entries(newParams).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					query[key] = String(value)
				}
			})

			router.replace({ query })
		},
		{ deep: true },
	)

	// Watch for changes in URL and update params
	watch(
		() => route.query,
		(newQuery) => {
			Object.entries(newQuery).forEach(([key, value]) => {
				if (key in params.value) {
					params.value[key as keyof T] = value as T[keyof T]
				}
			})
		},
		{ deep: true },
	)

	// Helper function to get a specific parameter
	const getParam = <K extends keyof T>(key: K): T[K] => {
		return params.value[key]
	}

	// Helper function to set a specific parameter
	const setParam = <K extends keyof T>(key: K, value: T[K]) => {
		params.value[key] = value
	}

	// Helper function to clear a specific parameter
	const clearParam = <K extends keyof T>(key: K) => {
		params.value[key] = null as T[K]
	}

	// Helper function to clear all parameters
	const clearAllParams = () => {
		Object.keys(params.value).forEach((key) => {
			params.value[key as keyof T] = null as T[keyof T]
		})
	}

	return {
		params,
		getParam,
		setParam,
		clearParam,
		clearAllParams,
	}
}
