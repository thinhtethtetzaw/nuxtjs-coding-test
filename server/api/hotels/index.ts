export default defineEventHandler(async (event) => {
  try {
    console.log("Fetching hotels from API...");
    const response = await $fetch("https://api.onlynx.co.th/api/v1/ct-hotels", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch hotels",
    });
  }
});
