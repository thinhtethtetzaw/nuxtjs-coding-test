import type { DefineComponent } from "vue"

export { default as AmenitiesTab } from "./AmenitiesTab.vue"
export { default as Card } from "./Card.vue"
export { default as ContactTab } from "./ContactTab.vue"
export { default as ImageGallery } from "./ImageGallery.vue"
export { default as Map } from "./Map.vue"
export { default as OverviewTab } from "./OverviewTab.vue"
export { default as PhotoGalleryModal } from "./PhotoGalleryModal.vue"
export { default as PoliciesTab } from "./PoliciesTab.vue"
export { default as RoomsTab } from "./RoomsTab.vue"
export { default as Tabs } from "./Tabs.vue"

export type CardComponent = DefineComponent<{}, {}, any>
export type ImageGalleryComponent = DefineComponent<{}, {}, any>
export type PhotoGalleryModalComponent = DefineComponent<{}, {}, any>
export type MapComponent = DefineComponent<{}, {}, any>
export type AmenitiesTabComponent = DefineComponent<{}, {}, any>
export type ContactTabComponent = DefineComponent<{}, {}, any>
export type OverviewTabComponent = DefineComponent<{}, {}, any>
export type PoliciesTabComponent = DefineComponent<{}, {}, any>
export type RoomsTabComponent = DefineComponent<{}, {}, any>
export type TabsComponent = DefineComponent<{}, {}, any>
