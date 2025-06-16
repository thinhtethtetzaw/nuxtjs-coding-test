export interface THotel {
	id: number
	hotel_name: string
	slug: string
	chain_code: string
	hotel_code: string
	city_name?: string
	country_name?: string
	state_prov?: string
	description?: string
	currency_code: string
	avg_price: number
	rating: string
	position: {
		latitude: string
		longitude: string
	}
	address: Array<{
		cityName: string
		stateProv: string
		postalCode: string
		addressLine: string
		countryName: string
		stateProvCode: string
		countryNameCode: string
	}>
	phone: Array<{
		phoneNumber: string
		phoneTechType: string
	}>
	policy_info: {
		CheckInTime: string
		CheckOutTime: string
	}
	amenities: Array<{
		id: number
		code: string
		name: string
		created_at: string
		updated_at: string
		pivot: {
			hotel_id: number
			shiji_hotel_amenity_code_id: number
		}
	}>
	gallery_all: Array<{
		url: string
		gallery_category_type: string
	}>
	currency: string
	exchange_rate: number
}

export interface THotelSearch {
	result: number
	message: string
	data: [
		{
			id: number
			hotel_name: string
			slug: string
			chain_code: string
			hotel_code: string
			city_name: string
			country_name: string
			state_prov: string
		},
	]
}
