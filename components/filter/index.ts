import type { DefineComponent } from "vue"

export { default as Amenities } from "./Amenities.vue"
export { default as HotelsFilterResults } from "./HotelsFilterResults.vue"
export { default as HotelsSearch } from "./HotelsSearch.vue"
export { default as PriceRange } from "./PriceRange.vue"

export type HotelsSearchComponent = DefineComponent<{}, {}, any>
export type HotelsResultsComponent = DefineComponent<{}, {}, any>
export type AmenitiesComponent = DefineComponent<{}, {}, any>
export type PriceRangeComponent = DefineComponent<{}, {}, any>
