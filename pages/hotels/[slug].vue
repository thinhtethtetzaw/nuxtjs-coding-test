<template>
	<div class="min-h-screen">
		<!-- Header Navigation -->
		<NuxtLink to="/" class="mb-5 flex items-center gap-2 text-gray-700">
			<ChevronLeftIcon class="h-4 w-4" /> Back to Hotels
		</NuxtLink>

		<!-- Main Content -->
		<div v-if="hotelData.hotel_name">
			<!-- Hotel Header -->
			<Card>
				<div class="flex items-start justify-between">
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
			</Card>

			<!-- Image Gallery -->
			<div class="mb-6 rounded-xl bg-white p-6">
				<div class="grid h-96 grid-cols-12 gap-4">
					<!-- Main Image -->
					<div class="col-span-6">
						<img
							:src="hotelData.gallery_all?.[0]?.url || '/placeholder-hotel.jpg'"
							:alt="hotelData.hotel_name"
							class="h-full w-full rounded-lg object-cover"
						/>
					</div>
					<!-- Side Images -->
					<div class="col-span-6 grid grid-cols-2 gap-4">
						<img
							v-for="(image, index) in hotelData.gallery_all?.slice(1, 4)"
							:key="index"
							:src="image.url"
							:alt="hotelData.hotel_name"
							class="h-full w-full rounded-lg object-cover"
						/>
						<!-- More Photos Overlay -->
						<div class="relative">
							<img
								:src="
									hotelData.gallery_all?.[4]?.url ||
									hotelData.gallery_all?.[1]?.url
								"
								:alt="hotelData.hotel_name"
								class="h-full w-full rounded-lg object-cover"
							/>
							<div
								class="bg-opacity-60 absolute inset-0 flex items-center justify-center rounded-lg bg-black"
							>
								<div class="text-center text-white">
									<span class="text-3xl font-bold"
										>+
										{{
											Math.max(0, (hotelData.gallery_all?.length || 0) - 4)
										}}</span
									>
									<p class="text-sm font-medium">Photos</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Content Grid -->
			<div class="grid grid-cols-12 gap-6">
				<!-- Left Column -->
				<div class="col-span-8 space-y-6">
					<!-- Popular Amenities -->
					<Card>
						<h2 class="mb-6 text-xl font-semibold text-gray-900">
							Popular Amenities
						</h2>
						<div class="grid grid-cols-3 gap-6">
							<div
								v-for="amenity in hotelData.amenities?.slice(0, 6)"
								:key="amenity.id"
								class="flex items-center gap-3"
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100"
								>
									<span class="text-orange-600">🏨</span>
								</div>
								<span class="text-sm text-gray-700">{{ amenity.name }}</span>
							</div>
						</div>
						<button
							v-if="hotelData.amenities?.length > 6"
							class="mt-6 font-medium text-orange-500 hover:text-orange-600"
						>
							View All Amenities
						</button>
					</Card>

					<!-- Tabs Section -->
					<div class="rounded-lg bg-white shadow-sm">
						<div class="border-b border-gray-200">
							<nav class="flex">
								<button
									class="border-b-2 border-orange-500 px-6 py-4 font-medium text-orange-500"
								>
									Rooms
								</button>
								<button
									class="px-6 py-4 font-medium text-gray-500 hover:text-gray-700"
								>
									About Property
								</button>
								<button
									class="px-6 py-4 font-medium text-gray-500 hover:text-gray-700"
								>
									Amenities
								</button>
								<button
									class="px-6 py-4 font-medium text-gray-500 hover:text-gray-700"
								>
									Location
								</button>
								<button
									class="px-6 py-4 font-medium text-gray-500 hover:text-gray-700"
								>
									Reviews
								</button>
							</nav>
						</div>

						<!-- Rooms Content -->
						<div class="p-6">
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
												:src="room.gallery?.[0]?.url || '/placeholder-room.jpg'"
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
												v-for="(ratePlan, planIndex) in room.rate_plans?.slice(
													0,
													2,
												)"
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
					</div>
				</div>

				<!-- Right Column -->
				<div class="col-span-4 space-y-4">
					<!-- Location -->

					<!-- Modern Map Container -->
					<div
						class="relative h-56 overflow-hidden rounded-xl border border-gray-200"
					>
						<!-- Google Maps Embed -->
						<iframe
							:src="`https://maps.google.com/maps?q=${hotelData.position?.latitude},${hotelData.position?.longitude}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=16&ie=UTF8&iwloc=&output=embed`"
							class="relative z-10 h-full w-full rounded-xl border-0"
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							style="filter: contrast(1.1) saturate(1.2)"
							@load="mapLoaded = true"
						>
						</iframe>

						<!-- Modern Map Controls -->
						<div class="absolute bottom-6 left-6 z-40">
							<div class="flex flex-col gap-2">
								<!-- Zoom In -->
								<button
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
								>
									<svg
										class="h-4 w-4 text-gray-700"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
								</button>
								<!-- Zoom Out -->
								<button
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
								>
									<svg
										class="h-4 w-4 text-gray-700"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M18 12H6"
										/>
									</svg>
								</button>
							</div>
						</div>

						<!-- Map Type Toggle -->
						<div class="absolute right-6 bottom-6 z-40">
							<button
								@click="toggleMapType"
								class="rounded-lg border border-gray-200/50 bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
							>
								{{ mapType === "roadmap" ? "Satellite" : "Map" }}
							</button>
						</div>

						<!-- Loading State -->
						<div
							v-if="!mapLoaded"
							class="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100"
						>
							<div class="text-center">
								<div class="relative mx-auto mb-4 h-12 w-12">
									<!-- Modern loading spinner -->
									<div
										class="absolute inset-0 rounded-full border-4 border-blue-200"
									></div>
									<div
										class="absolute inset-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
									></div>
								</div>
								<p class="text-sm font-medium text-gray-600">Loading map...</p>
							</div>
						</div>
					</div>

					<!-- Address Card -->
					<Card>
						<div class="flex items-start gap-3">
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
							<Button @click="copyAddress" variant="ghost">
								<CopyIcon class="h-4 w-4 text-gray-700" />
							</Button>
						</div>
					</Card>

					<!-- Action Buttons -->
					<Button
						@click="getDirections"
						variant="primary"
						size="md"
						class="flex w-full items-center gap-2"
					>
						<MapIcon class="h-4 w-4 text-white" />
						Get Directions
					</Button>

					<!-- Fare Summary -->
					<Card>
						<h3 class="mb-4 text-lg font-semibold text-gray-900">
							Fare Summary
						</h3>

						<div class="mb-4 space-y-3">
							<div>
								<p class="text-sm text-gray-600">Room Type</p>
								<p class="font-medium">
									{{ hotelData.rooms?.[0]?.room_type || "Standard Room" }}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">
									Check-in Date & Check-out Date
								</p>
								<p class="font-medium">
									Check-in: {{ hotelData.policy_info?.CheckInTime || "14:00" }}
								</p>
								<p class="font-medium">
									Check-out:
									{{ hotelData.policy_info?.CheckOutTime || "12:00" }}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Room(s) & Traveller(s)</p>
								<p class="font-medium">
									2 Rooms,
									{{ hotelData.rooms?.[0]?.max_occupancy || 2 }} Travellers
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-600">Contact</p>
								<p
									class="font-medium"
									v-for="phone in hotelData.phone"
									:key="phone.phoneNumber"
								>
									{{ phone.phoneNumber }}
								</p>
							</div>
						</div>

						<div class="space-y-2 border-t pt-4">
							<div class="flex justify-between">
								<span class="font-semibold">Total Base Fare</span>
								<span class="font-semibold"
									>{{ hotelData.currency_code }} {{ hotelData.avg_price }}</span
								>
							</div>
							<p class="text-xs text-gray-500">2 Rooms x 2 Nights</p>
							<p class="text-xs text-gray-500">
								{{ hotelData.currency_code }}
								{{ Math.round(hotelData.avg_price / 2) }} average per night per
								room
							</p>

							<div class="mt-3 flex justify-between">
								<span>Service Fees</span>
								<span
									>{{ hotelData.currency_code }}
									{{ Math.round(hotelData.avg_price * 0.1) }}</span
								>
							</div>

							<div class="flex justify-between">
								<span>Taxes & Fees</span>
								<span
									>{{ hotelData.currency_code }}
									{{ Math.round(hotelData.avg_price * 0.15) }}</span
								>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>

		<!-- Loading State -->

		<div v-else class="flex h-96 items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"
				></div>
				<p class="text-xl text-gray-600">Loading hotel details...</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { StarIcon } from "lucide-vue-next"
import { ChevronLeftIcon, MapIcon, CopyIcon } from "lucide-vue-next"
import { Button, Card } from "~/components/common"

const route = useRoute()

const {
	data: hotel,
	pending,
	error,
} = useApi(`/api/hotels/${route.params.slug}`, {
	method: "POST",
	key: `hotel-details-${route.params.slug}`,
	cache: true,
	immediate: true,
	watch: false,
})

// Extract hotel data from API response
const hotelData = computed(() => hotel.value?.data || {})

// Map state
const mapLoaded = ref(false)
const mapType = ref("roadmap")

// Map functions
const openGoogleMaps = () => {
	const lat = hotelData.value.position?.latitude
	const lng = hotelData.value.position?.longitude
	if (lat && lng) {
		const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
		window.open(url, "_blank")
	}
}

const getDirections = () => {
	const lat = hotelData.value.position?.latitude
	const lng = hotelData.value.position?.longitude
	if (lat && lng) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
		window.open(url, "_blank")
	}
}

const toggleMapType = () => {
	mapType.value = mapType.value === "roadmap" ? "satellite" : "roadmap"
	// The map will automatically update due to the reactive URL binding
}

const copyAddress = async () => {
	const address = hotelData.value.address?.[0]
	if (address) {
		const fullAddress = `${address.addressLine}, ${address.cityName}, ${address.stateProv}, ${address.postalCode}`
		try {
			await navigator.clipboard.writeText(fullAddress)
			// You could add a toast notification here
			console.log("Address copied to clipboard")
		} catch (err) {
			console.error("Failed to copy address:", err)
		}
	}
}
</script>
