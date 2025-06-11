import type { DefineComponent } from "vue"

export { default as AmenitiesFilter } from "./AmenitiesFilter.vue"
export { default as HotelsFilterResults } from "./HotelsFilterResults.vue"
export { default as HotelsSearchFilter } from "./HotelsSearchFilter.vue"
export { default as PriceRangeFilter } from "./PriceRangeFilter.vue"

export type HotelsSearchFilterComponent = DefineComponent<{}, {}, any>
export type HotelsFilterResultsComponent = DefineComponent<{}, {}, any>
export type AmenitiesFilterComponent = DefineComponent<{}, {}, any>
export type PriceRangeFilterComponent = DefineComponent<{}, {}, any>
