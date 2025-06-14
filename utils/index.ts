import dayjs from "dayjs"

export const formatTime = (time: string | undefined) => {
	if (!time) return "02:00 PM"

	// If the time is in HH:mm:ss format, format it to hh:mm AM/PM
	if (time.includes(":")) {
		const [hours, minutes] = time.split(":")
		const hour = parseInt(hours, 10)
		const ampm = hour >= 12 ? "PM" : "AM"
		const hour12 = hour % 12 || 12 // Convert to 12-hour format
		return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`
	}

	// If it's a full date, format it to YYYY-MM-DD
	return dayjs(time).format("YYYY-MM-DD")
}
