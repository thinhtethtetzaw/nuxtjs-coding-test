import type { DefineComponent } from "vue"

export { default as HotelCard } from "./HotelCard.vue"
export { default as ImageGallery } from "./ImageGallery.vue"
export { default as Map } from "./Map.vue"
export { default as PhotoGalleryModal } from "./PhotoGalleryModal.vue"

export type HotelCardComponent = DefineComponent<{}, {}, any>
export type ImageGalleryComponent = DefineComponent<{}, {}, any>
export type PhotoGalleryModalComponent = DefineComponent<{}, {}, any>
export type MapComponent = DefineComponent<{}, {}, any>
