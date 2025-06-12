import type { DefineComponent } from "vue"

export { default as Button } from "./Button.vue"
export { default as Card } from "./Card.vue"
export { default as SkeletonLoading } from "./SkeletonLoading.vue"
export { default as SpinnerLoading } from "./SpinnerLoading.vue"

export type SkeletonLoadingComponent = DefineComponent<{}, {}, any>
export type SpinnerLoadingComponent = DefineComponent<{}, {}, any>
export type CardComponent = DefineComponent<{}, {}, any>
export type ButtonComponent = DefineComponent<{}, {}, any>
