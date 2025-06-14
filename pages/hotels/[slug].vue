<template>
	<div
		v-if="isHotelDetailLoading"
		class="flex h-96 items-center justify-center"
	>
		<CommonSpinnerLoading :is-loading="true" />
	</div>
	<div v-else class="min-h-screen">
		<NuxtLink
			:to="{
				path: '/',
				query: {
					...route.query,
					search: hotelData.hotel_name,
				},
			}"
			class="mb-5 flex items-center gap-2 text-base text-gray-700"
		>
			<ChevronLeftIcon class="size-5" /> Back to Hotels
		</NuxtLink>

		<div v-if="hotelData.hotel_name" class="space-y-6">
			<div
				class="flex items-start justify-between rounded-xl border border-gray-200 p-6"
			>
				<div class="flex-1">
					<h1 class="mb-2 text-3xl font-semibold text-gray-700">
						{{ hotelData.hotel_name }}
					</h1>
					<div class="mb-4 flex items-center gap-4">
						<div class="flex items-center gap-2">
							<div class="flex items-center">
								<StarIcon
									v-for="n in 5"
									:key="'star-' + n"
									:class="[
										n <= Math.floor(Number(hotelData.rating))
											? 'fill-yellow-400 text-yellow-400'
											: 'fill-gray-300 text-gray-300',
										'h-4 w-4',
									]"
								/>
							</div>
						</div>
					</div>
					<p class="flex items-center gap-1 text-gray-600">
						{{ hotelData.address?.[0]?.cityName }}
					</p>
				</div>
				<div class="text-right">
					<div class="mb-2 flex items-center gap-2">
						<span class="text-2xl font-bold text-gray-900"
							>{{ hotelData.currency }} {{ hotelData.avg_price }}</span
						>
					</div>
				</div>
			</div>

			<HotelImageGallery
				:images="hotelData.gallery_all"
				:hotel-name="hotelData.hotel_name"
				@open-gallery="togglePhotoGallery"
			/>

			<div class="mt-10 grid grid-cols-12 gap-6">
				<!-- Left Column -->
				<div class="col-span-8 space-y-6">
					<div>
						<h2 class="mb-6 text-xl font-semibold text-gray-900">Facilities</h2>
						<div class="grid grid-cols-3 gap-6">
							<div
								v-for="amenity in showAllAmenities
									? hotelData.amenities
									: hotelData.amenities?.slice(0, 6)"
								:key="amenity.id"
								class="flex items-center gap-3"
							>
								<CheckIcon class="text-primary size-4" />
								<span class="text-gray-700">{{ amenity.name }}</span>
							</div>
						</div>
						<CommonButton
							variant="ghost"
							v-if="hotelData.amenities?.length > 6"
							@click="toggleAmenities"
							class="text-primary mt-6 !px-0 font-medium hover:text-blue-400"
						>
							{{ showAllAmenities ? "Show Less" : `View All Amenities` }}
						</CommonButton>
					</div>

					<HotelTabWrapper
						:tabs="tabs"
						:activeTab="activeTab"
						@update:activeTab="activeTab = $event"
					>
						<template #default="{ activeTab }">
							<HotelTabOverview
								v-if="activeTab === 'overview'"
								:hotelData="hotelData"
							/>
							<HotelTabRooms
								v-else-if="activeTab === 'rooms'"
								:hotelData="hotelData"
							/>
							<HotelTabAmenities
								v-else-if="activeTab === 'amenities'"
								:hotelData="hotelData"
							/>
							<HotelTabPolicies
								v-else-if="activeTab === 'policies'"
								:hotelData="hotelData"
								:getPaymentMethodName="getPaymentMethodName"
							/>
							<HotelTabContact
								v-else-if="activeTab === 'contact'"
								:hotelData="hotelData"
							/>
						</template>
					</HotelTabWrapper>
				</div>

				<!-- Right Column -->
				<div class="sticky top-6 col-span-4 space-y-4 self-start">
					<HotelMap
						:latitude="hotelData.position?.latitude"
						:longitude="hotelData.position?.longitude"
					/>

					<div class="flex flex-col items-start gap-3">
						<div class="flex-1">
							<p class="mb-2 text-base font-semibold text-gray-900">
								Hotel Address
							</p>
							<p class="leading-relaxed text-gray-700">
								{{ hotelData.address?.[0]?.cityName }},
								{{ hotelData.address?.[0]?.stateProv }}<br />
								Postal Code: {{ hotelData.address?.[0]?.postalCode }}
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
			:images="hotelData.gallery_all"
			:hotel-name="hotelData.hotel_name"
			@close="togglePhotoGallery"
		/>
	</div>
</template>

<script setup>
import {
	ChevronLeftIcon,
	MapIcon,
	CopyIcon,
	StarIcon,
	CheckIcon,
	PhoneIcon,
	CreditCardIcon,
	BanknoteIcon,
	WalletIcon,
} from "lucide-vue-next"

const route = useRoute()
const isPhotoGalleryOpen = ref(false)
const showAllAmenities = ref(false)
const activeTab = ref("overview")

const {
	data: hotel,
	pending: isHotelDetailLoading,
	error,
} = useApi(`/api/hotels/${route.params.slug}`, {
	method: "POST",
	key: `hotel-details-${route.params.slug}`,
	cache: true,
	immediate: true,
	watch: false,
})

const hotelData = computed(() => hotel.value?.data || {})

const getDirections = () => {
	const lat = hotelData.value.position?.latitude
	const lng = hotelData.value.position?.longitude
	if (lat && lng) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
		window.open(url, "_blank")
	}
}

const copyAddress = async () => {
	const address = hotelData.value.address?.[0]
	if (address) {
		const fullAddress = `${address.addressLine}, ${address.cityName}, ${address.stateProv}, ${address.postalCode}`
	}
}

const togglePhotoGallery = () => {
	isPhotoGalleryOpen.value = !isPhotoGalleryOpen.value
}

const toggleAmenities = () => {
	showAllAmenities.value = !showAllAmenities.value
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

const getPaymentIcon = (cardCode) => {
	const iconMap = {
		AX: CreditCardIcon,
		CA: CreditCardIcon,
		DC: CreditCardIcon,
		DR: CreditCardIcon,
		GS: CreditCardIcon,
		GW: WalletIcon,
		JC: CreditCardIcon,
		MC: CreditCardIcon,
		ME: CreditCardIcon,
		OC: CreditCardIcon,
		PC: CreditCardIcon,
		PD: BanknoteIcon,
		PE: BanknoteIcon,
		UP: CreditCardIcon,
		VA: CreditCardIcon,
		VX: CreditCardIcon,
	}
	return iconMap[cardCode] || CreditCardIcon
}

const tabs = [
	{ key: "overview", label: "Overview" },
	{ key: "rooms", label: "Rooms & Rates" },
	{ key: "amenities", label: "Amenities" },
	{ key: "policies", label: "Policies" },
	{ key: "contact", label: "Contact Information" },
]
</script>
