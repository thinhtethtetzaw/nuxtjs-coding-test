import type { DefineComponent } from "vue"

export { default as SkeletonLoading } from "./SkeletonLoading.vue"
export { default as SpinnerLoading } from "./SpinnerLoading.vue"

export type SkeletonLoadingComponent = DefineComponent<{}, {}, any>
export type SpinnerLoadingComponent = DefineComponent<{}, {}, any>
