<template>
	<!-- TODO: Add search func -->
	<CommonStickySearchBar :show="true" @search-hotels="searchHotels" />
	<div
		v-if="isHotelDetailLoading"
		class="flex h-96 items-center justify-center pt-20"
	>
		<CommonSpinnerLoading :is-loading="true" />
	</div>
	<div v-else class="min-h-screen">
		<NuxtLink
			:to="{
				path: '/',
				query: route.query,
			}"
			class="mt-12 mb-5 flex items-center gap-2 text-base text-gray-700"
		>
			<ChevronLeftIcon class="size-5" /> Back to Hotels
		</NuxtLink>

		<div v-if="hotelDetailData.hotel_name" class="space-y-6">
			<HotelImageGallery
				:images="hotelDetailData.gallery_all"
				:hotel-name="hotelDetailData.hotel_name"
				@open-gallery="togglePhotoGallery"
			/>

			<div class="mt-10 grid grid-cols-12 gap-6">
				<!-- Left Column -->
				<div class="col-span-8 space-y-6">
					<HotelDetailOverview
						v-if="activeTab === 'overview'"
						:hotelData="hotelDetailData"
					/>

					<HotelTabWrapper
						:tabs="tabs"
						:activeTab="activeTab"
						@update:activeTab="activeTab = $event"
					>
						<template #default="{ activeTab }">
							<HotelTabRooms v-if="activeTab === 'rooms'" />
							<HotelTabAmenities
								v-else-if="activeTab === 'amenities'"
								:hotelData="hotelDetailData"
							/>
							<HotelTabPolicies
								v-else-if="activeTab === 'policies'"
								:hotelData="hotelDetailData"
								:getPaymentMethodName="getPaymentMethodName"
							/>
							<HotelTabContact
								v-else-if="activeTab === 'contact'"
								:hotelData="hotelDetailData"
							/>
						</template>
					</HotelTabWrapper>
				</div>

				<!-- Right Column -->
				<div class="sticky top-6 col-span-4 space-y-4 self-start">
					<HotelMap
						:latitude="hotelDetailData.position?.latitude"
						:longitude="hotelDetailData.position?.longitude"
					/>

					<div class="flex flex-col items-start gap-3">
						<div class="flex-1">
							<p class="mb-2 text-base font-semibold text-gray-900">
								Hotel Address
							</p>
							<p class="leading-relaxed text-gray-700">
								{{ hotelDetailData.address?.[0]?.cityName }},
								{{ hotelDetailData.address?.[0]?.stateProv }}<br />
								Postal Code: {{ hotelDetailData.address?.[0]?.postalCode }}
							</p>
						</div>
						<div class="flex w-full gap-2">
							<CommonButton
								variant="outline"
								@click="copyAddress"
								class="flex w-full items-center gap-2"
							>
								<CopyIcon class="h-4 w-4 text-gray-700" />
								Copy Address
							</CommonButton>
							<CommonButton
								@click="getDirections"
								variant="primary"
								size="md"
								class="flex w-full items-center gap-2"
							>
								<MapIcon class="h-4 w-4 text-white" />
								Get Directions
							</CommonButton>
						</div>
					</div>
				</div>
			</div>
		</div>

		<HotelPhotoGalleryModal
			:is-open="isPhotoGalleryOpen"
			:images="hotelDetailData.gallery_all"
			:hotel-name="hotelDetailData.hotel_name"
			@close="togglePhotoGallery"
		/>
	</div>
</template>

<script setup>
import { ChevronLeftIcon, MapIcon, CopyIcon } from "lucide-vue-next"
import { useUrlParams } from "~/composables/useUrlParams"

const route = useRoute()
const router = useRouter()
const { getParam } = useUrlParams()
const isPhotoGalleryOpen = ref(false)
const activeTab = ref("rooms")

const { data: hotel, pending: isHotelDetailLoading } = useFetch(
	`/api/hotels/${route.params.slug}`,
	{
		method: "POST",
		lazy: false,
		immediate: true,
		$fetch: useNuxtApp().$api,
	},
)

const hotelDetailData = computed(() => hotel.value?.data || {})

const getDirections = () => {
	const lat = hotelDetailData.value.position?.latitude
	const lng = hotelDetailData.value.position?.longitude
	if (lat && lng) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
		window.open(url, "_blank")
	}
}

const copyAddress = async () => {
	const address = hotelDetailData.value.address?.[0]
	if (address)
		`${address.addressLine}, ${address.cityName}, ${address.stateProv}, ${address.postalCode}`
}

const togglePhotoGallery = () => {
	isPhotoGalleryOpen.value = !isPhotoGalleryOpen.value
}

const getPaymentMethodName = (cardCode) => {
	const paymentMethods = {
		AX: "American Express",
		CA: "MasterCard",
		DC: "Diners Club",
		DR: "Discover",
		GS: "Goldman Sachs",
		GW: "Gateway",
		JC: "JCB",
		MC: "MasterCard",
		ME: "Maestro",
		OC: "Other Credit Card",
		PC: "Private Card",
		PD: "Postpaid",
		PE: "Prepaid",
		UP: "UnionPay",
		VA: "Visa",
		VX: "Visa Electron",
	}
	return paymentMethods[cardCode] || cardCode
}

const tabs = [
	{ key: "rooms", label: "Rooms & Rates" },
	{ key: "amenities", label: "Amenities" },
	{ key: "policies", label: "Policies" },
	{ key: "contact", label: "Contact Information" },
]

const searchHotels = () => {
	if (getParam("search") === hotelDetailData.value.hotel_name) {
		router.push({
			path: route.path,
			query: route.query,
		})
	} else {
		router.push({
			path: "/",
			query: { ...route.query, search: getParam("search") },
		})
	}
}
</script>
