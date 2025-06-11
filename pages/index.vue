<template>
	<section>
		<!-- Banner -->
		<div class="relative">
			<div
				class="relative mb-[-60px] h-[60vh] overflow-hidden rounded-3xl p-28 before:absolute before:inset-0 before:bg-black/40 before:content-['']"
			>
				<img
					src="/images/hotel-banner.png"
					alt="banner"
					class="absolute inset-0 -z-1 h-full w-full object-cover"
				/>
				<div class="relative z-10 space-y-4 text-left text-white">
					<h1 class="text-6xl font-bold opacity-80 drop-shadow">
						Find Your Dream Stay
					</h1>
					<p class="mt-8 text-xl opacity-80 drop-shadow">
						From luxury retreats to cozy hideaways,<br />
						we help you find the perfect place to create lasting memories
					</p>
					<button
						class="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none active:scale-100"
					>
						Explore
					</button>
				</div>
			</div>
			<div
				class="absolute -bottom-10 left-1/2 z-10 w-5/6 -translate-x-1/2 transform"
			>
				<div
					class="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-lg"
				>
					<HotelsSearchFilter v-model="searchQuery" @select="onHotelSelect" />
				</div>
			</div>
		</div>

		<!-- Hotel List -->
		<div class="mx-auto mt-32 grid grid-cols-12 gap-6">
			<div class="col-span-4">
				<h2 class="mb-4 text-2xl font-bold">Filter By:</h2>
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-2">
						<input type="checkbox" id="filter-by-price" />
						<label for="filter-by-price">Price</label>
					</div>
				</div>
			</div>
			<div class="col-span-8">
				<Loading :is-loading="isHotelsLoading" />
				<div v-if="error" class="py-8 text-center">
					{{ error.message || "Failed to load hotels" }}
				</div>
				<div v-if="!isHotelsLoading">
					<h2 class="mb-4 text-2xl font-bold">Discover Our Collection</h2>
					<div class="grid grid-cols-3 gap-6">
						<HotelCard
							v-for="hotel in hotels.data"
							:key="hotel.id || hotel.slug"
							:hotel="hotel"
							@book-now="onHotelBook"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from "vue"
import HotelCard from "~/components/hotel/HotelCard.vue"
import HotelsSearchFilter from "~/components/filter/HotelsSearchFilter.vue"
import Loading from "~/components/common/Loading.vue"

const searchQuery = ref("")

const {
	data: hotels,
	pending: isHotelsLoading,
	error,
} = await useApi("/api/hotels", {
	method: "POST",
	immediate: true,
	watch: false,
	server: false,
})

const onHotelSelect = (selectedHotel) => {
	searchQuery.value = selectedHotel.hotel_name
	hotels.value = { data: [selectedHotel] }
}

const onHotelBook = (hotel) => {
	console.log("Booking hotel:", hotel.hotel_name)
}
</script>
