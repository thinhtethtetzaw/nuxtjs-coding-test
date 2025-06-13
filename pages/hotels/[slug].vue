<template>
	<div
		v-if="isHotelDetailLoading"
		class="flex h-96 items-center justify-center"
	>
		<CommonSpinnerLoading :is-loading="true" />
	</div>
	<div v-else class="min-h-screen">
		<NuxtLink to="/" class="mb-5 flex items-center gap-2 text-gray-700">
			<ChevronLeftIcon class="h-4 w-4" /> Back to Hotels
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
								<span class="text-sm text-gray-700">{{ amenity.name }}</span>
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

					<!-- Tabs Section -->
					<div class="rounded-2xl border border-gray-200 bg-white">
						<div class="relative flex border-b-2 border-gray-200">
							<CommonButton
								variant="ghost"
								@click="activeTab = 'overview'"
								:class="[
									activeTab === 'overview'
										? 'border-primary relative -mb-0.5 border-b-2 bg-blue-50'
										: '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900',
									'rounded-none px-6 py-3 font-medium transition-all duration-200',
								]"
							>
								Overview
							</CommonButton>
							<CommonButton
								variant="ghost"
								@click="activeTab = 'rooms'"
								:class="[
									activeTab === 'rooms'
										? 'border-primary relative -mb-px border-b-2 bg-blue-50'
										: '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900',
									'rounded-none px-6 py-3 font-medium transition-all duration-200',
								]"
							>
								Rooms & Rates
							</CommonButton>
							<CommonButton
								variant="ghost"
								@click="activeTab = 'amenities'"
								:class="[
									activeTab === 'amenities'
										? 'border-primary relative -mb-px border-b-2 bg-blue-50'
										: '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900',
									'rounded-none px-6 py-3 font-medium transition-all duration-200',
								]"
							>
								Amenities
							</CommonButton>
							<CommonButton
								variant="ghost"
								@click="activeTab = 'policies'"
								:class="[
									activeTab === 'policies'
										? 'border-primary relative -mb-px border-b-2 bg-blue-50'
										: '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900',
									'rounded-none px-6 py-3 font-medium transition-all duration-200',
								]"
							>
								Policies
							</CommonButton>
							<CommonButton
								variant="ghost"
								@click="activeTab = 'contact'"
								:class="[
									activeTab === 'contact'
										? 'border-primary relative -mb-px border-b-2 bg-blue-50'
										: '!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900',
									'rounded-none px-6 py-3 font-medium transition-all duration-200',
								]"
							>
								Contact Information
							</CommonButton>
						</div>

						<!-- Tab Content -->
						<div class="p-6">
							<!-- Overview Content -->
							<div v-if="activeTab === 'overview'" class="space-y-8">
								<div class="space-y-2">
									<h4 class="text-lg font-semibold text-gray-900">
										Description
									</h4>
									<p class="text-gray-700">
										{{ hotelData.description }}
									</p>
								</div>
								<div class="grid gap-8 lg:grid-cols-2">
									<div class="rounded-2xl bg-gray-50 p-4">
										<h4 class="mb-4 text-lg font-semibold text-gray-900">
											Stay Details
										</h4>
										<div class="space-y-2">
											<div class="flex justify-between py-2">
												<span class="text-gray-600">Room Type</span>
												<span class="font-medium text-gray-900">{{
													hotelData.rooms?.[0]?.room_type || "Standard Room"
												}}</span>
											</div>
											<div class="flex justify-between py-2">
												<span class="text-gray-600">Check-in</span>
												<span class="font-medium text-gray-900">{{
													hotelData.policy_info?.CheckInTime || "14:00"
												}}</span>
											</div>
											<div class="flex justify-between py-2">
												<span class="text-gray-600">Check-out</span>
												<span class="font-medium text-gray-900">{{
													hotelData.policy_info?.CheckOutTime || "12:00"
												}}</span>
											</div>
											<div class="flex justify-between py-2">
												<span class="text-gray-600">Guests</span>
												<span class="font-medium text-gray-900"
													>{{
														hotelData.rooms?.[0]?.max_occupancy || 2
													}}
													Travellers</span
												>
											</div>
											<div class="flex justify-between">
												<div>
													<span class="text-gray-900">Average Price</span>
												</div>
												<span class="text-primary text-xl font-bold"
													>{{ hotelData.currency }}
													{{ hotelData.avg_price }}</span
												>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Rooms Content -->
							<div v-if="activeTab === 'rooms'">
								<h3 class="mb-4 text-lg font-semibold text-gray-900">
									Select Room
								</h3>

								<!-- Room Options -->
								<div
									v-for="(room, index) in hotelData.rooms"
									:key="room.id"
									class="mb-6 rounded-lg border border-gray-200"
								>
									<div class="p-6">
										<div class="flex gap-6">
											<!-- Room Image -->
											<div class="h-32 w-48 flex-shrink-0">
												<img
													:src="
														room.gallery?.[0]?.url || '/placeholder-room.jpg'
													"
													:alt="room.room_type"
													class="h-full w-full rounded-lg object-cover"
												/>
											</div>

											<!-- Room Details -->
											<div class="flex-1">
												<h4 class="mb-2 text-lg font-semibold text-gray-900">
													{{ room.room_type }}
												</h4>

												<!-- Room Features -->
												<div class="mb-4 space-y-2">
													<div
														class="flex items-center gap-2 text-sm text-gray-600"
													>
														✓ <span>Max {{ room.max_occupancy }} guests</span>
													</div>
													<div
														class="flex items-center gap-2 text-sm text-gray-600"
													>
														✓
														<span>{{
															room.size_measurement || "Spacious room"
														}}</span>
													</div>
													<div
														v-for="amenity in room.amenities?.slice(0, 2)"
														:key="amenity.id"
														class="flex items-center gap-2 text-sm text-gray-600"
													>
														✓ <span>{{ amenity.amenity_name }}</span>
													</div>
												</div>

												<button
													class="text-sm font-medium text-orange-500 hover:text-orange-600"
												>
													View all Amenities
												</button>
											</div>

											<!-- Room Rate Plans -->
											<div class="w-80 space-y-4">
												<!-- Rate Plan Options -->
												<div
													v-for="(
														ratePlan, planIndex
													) in room.rate_plans?.slice(0, 2)"
													:key="ratePlan.id"
													class="rounded-lg border border-gray-200 p-4"
												>
													<div class="mb-2 flex items-start justify-between">
														<span class="font-medium">{{
															ratePlan.rate_plan_name
														}}</span>
														<div class="text-right">
															<div class="flex items-center gap-2">
																<span class="text-sm text-gray-400 line-through"
																	>{{ hotelData.currency_code }}
																	{{
																		Math.round(ratePlan.pivot?.price * 1.15) ||
																		Math.round(hotelData.avg_price * 1.15)
																	}}</span
																>
																<span class="font-bold"
																	>{{ hotelData.currency_code }}
																	{{
																		ratePlan.pivot?.price || hotelData.avg_price
																	}}</span
																>
															</div>
															<p class="text-xs text-gray-500">
																per night for 2 Rooms
															</p>
														</div>
													</div>

													<!-- Benefits/Inclusions -->
													<div class="mb-2 text-sm text-gray-600">
														Inclusions<br />
														<div
															v-if="ratePlan.include_breakfast"
															class="flex items-center gap-1 text-xs"
														>
															✓ <span>Free Breakfast</span>
														</div>
														<div
															v-for="benefit in ratePlan.benefits?.slice(0, 2)"
															:key="benefit.id"
															class="flex items-center gap-1 text-xs"
														>
															✓ <span>{{ benefit.hint }}</span>
														</div>
														<div
															v-if="!ratePlan.no_cancel_ind"
															class="flex items-center gap-1 text-xs"
														>
															✓ <span>Free Cancellation</span>
														</div>
													</div>

													<!-- Cancellation Policy -->
													<div
														v-if="ratePlan.cancel_penalty_description"
														class="mb-3 text-xs text-gray-600"
													>
														<a href="#" class="text-orange-500"
															>{{
																ratePlan.cancel_penalty_description.substring(
																	0,
																	50,
																)
															}}...</a
														>
													</div>

													<button
														v-if="planIndex === 0"
														class="w-full rounded bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
													>
														Add 2 Rooms
													</button>
													<button
														v-else
														class="w-full rounded bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600"
													>
														✓ Added
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Amenities -->
							<div v-if="activeTab === 'amenities'">
								<div class="grid gap-8 lg:grid-cols-2">
									<div class="rounded-2xl bg-gray-50 p-4">
										<h4 class="mb-6 text-lg font-semibold text-gray-900">
											Hotel Facilities
										</h4>
										<div class="space-y-3">
											<div
												v-for="amenity in hotelData.amenities"
												:key="amenity.id"
												class="flex items-center gap-3"
											>
												<CheckIcon class="text-primary h-4 w-4" />
												<span class="text-gray-700">{{ amenity.name }}</span>
											</div>
										</div>
									</div>

									<div class="rounded-2xl bg-gray-50 p-4">
										<h4 class="mb-6 text-lg font-semibold text-gray-900">
											Room Features
										</h4>
										<div class="space-y-4">
											<div
												v-for="amenity in hotelData.rooms?.[0]?.amenities"
												:key="amenity.id"
												class="flex items-center gap-3"
											>
												<CheckIcon class="text-primary h-4 w-4" />
												<span class="text-gray-700">{{
													amenity.amenity_name
												}}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Policies Content -->
							<div v-if="activeTab === 'policies'">
								<div class="space-y-8">
									<!-- Cancellation Policy -->
									<div class="space-y-4">
										<h4 class="text-lg font-semibold text-gray-900">
											Cancellation Policy
										</h4>
										<div class="space-y-4">
											<div
												v-for="room in hotelData.rooms"
												:key="room.id"
												class="rounded-lg bg-gray-50 p-4"
											>
												<h5 class="mb-3 font-medium text-gray-900">
													{{ room.room_type }}
												</h5>

												<p class="mb-1 text-sm font-medium text-gray-700">
													<span class="font-bold">Penalty Description:</span>
													{{ room.policy_info.penalty_description }}
												</p>
											</div>
										</div>
									</div>

									<!-- Payment Policy -->
									<div class="space-y-4">
										<h4 class="text-lg font-semibold text-gray-900">
											Accepted Payment Methods
										</h4>

										<div
											v-for="payment in hotelData.guarantee_payment_policy"
											:key="payment"
											class="space-y-2"
										>
											<ul
												v-for="card in payment.acceptedPayments"
												:key="card.cardCode"
												class="flex items-center gap-4"
											>
												<li class="flex items-center gap-2 text-gray-700">
													<span
														class="size-1.5 rounded-full bg-gray-500"
													></span>
													{{
														getPaymentMethodName(card.cardCode) || card.cardCode
													}}
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							<!-- Contact Information -->
							<div v-if="activeTab === 'contact'" class="space-y-6">
								<div class="rounded-2xl bg-gray-50 p-4">
									<div class="mb-4 flex items-center gap-3">
										<h4 class="text-lg font-semibold text-gray-900">
											Phone Numbers
										</h4>
									</div>
									<div class="space-y-3">
										<div
											v-for="phone in hotelData.phone"
											:key="phone.phoneNumber"
											class="flex items-center justify-between rounded-lg bg-white p-4 py-2.5"
										>
											<div class="flex items-center gap-3">
												<div class="rounded-full bg-green-100 p-2">
													<PhoneIcon class="h-4 w-4 text-green-600" />
												</div>
												<p class="font-semibold text-gray-900">
													{{ phone.phoneNumber }}
												</p>
											</div>
											<a
												:href="'tel:' + phone.phoneNumber"
												class="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
											>
												Call Now
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Column -->
				<div class="sticky top-6 col-span-4 space-y-4 self-start">
					<HotelMap
						:latitude="hotelData.position?.latitude"
						:longitude="hotelData.position?.longitude"
					/>

					<!-- Address Card -->
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
</script>
