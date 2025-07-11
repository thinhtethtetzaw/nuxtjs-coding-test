import type { THotel } from "~/types"

interface ApiResponse {
	data: THotel[]
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)

		const searchResponse = await $fetch<ApiResponse>(
			"https://api.onlynx.co.th/api/v1/ct-hotels/search",
			{
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				body,
			},
		)

		const hotelListResponse = await $fetch<ApiResponse>(
			"https://api.onlynx.co.th/api/v1/ct-hotels",
			{
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			},
		)

		const searchResultsMap = new Map(
			searchResponse.data.map((hotel) => [hotel.id, hotel]),
		)

		const filteredHotels = hotelListResponse.data.filter((hotel) =>
			searchResultsMap.has(hotel.id),
		)

		const transformedData = {
			result: 1,
			message: "success",
			data: filteredHotels.map((hotel: THotel) => ({
				id: hotel.id,
				hotel_name: hotel.hotel_name,
				slug: hotel.slug,
				chain_code: hotel.chain_code,
				hotel_code: hotel.hotel_code,
				city_name: hotel.city_name || "",
				country_name: hotel.country_name || "",
				state_prov: hotel.state_prov || "",
				description: hotel.description || "",
				currency_code: hotel.currency_code,
				avg_price: hotel.avg_price,
				rating: hotel.rating,
				position: hotel.position,
				address: hotel.address,
				phone: hotel.phone,
				policy_info: hotel.policy_info,
				amenities: hotel.amenities,
				gallery_all: hotel.gallery_all,
				currency: hotel.currency,
				exchange_rate: hotel.exchange_rate,
			})),
		}

		return transformedData
	} catch (error) {
		console.error("Error in custom hotel search:", error)
		throw createError({
			statusCode: 500,
			message: "Failed to search hotels",
		})
	}
})
