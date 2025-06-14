export default defineEventHandler(async (event) => {
	const slug = event.context.params?.slug
	const body = await readBody(event)

	const response = await $fetch(
		`https://api.onlynx.co.th/api/v1/ct-hotels/${slug}/rooms`,
		{
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body,
		},
	)

	return response
})
