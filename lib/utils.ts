import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"
import { computed } from "vue"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

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

export const createUrlParamComputed = (
	getParam: (key: string) => string | null,
	setParam: (key: string, value: any) => void,
	paramName: string,
	defaultValue: any = null,
	transform: (v: any) => any = (v) => v,
) => {
	return computed({
		get: () => {
			const value = getParam(paramName)
			return value !== null ? transform(value) : defaultValue
		},
		set: (value) => setParam(paramName, value),
	})
}

export const createDateParamComputed = (
	getParam: (key: string) => string | null,
	setParam: (key: string, value: any) => void,
	paramName: string,
	validateWith: string | null = null,
	isCheckIn: boolean = false,
) => {
	return computed({
		get: () => getParam(paramName),
		set: (value: string) => {
			if (!value) return

			const newDate = dayjs(value)
			const today = dayjs().startOf("day")

			// For check-in date
			if (isCheckIn) {
				if (newDate.isBefore(today)) {
					setParam(paramName, today.format("YYYY-MM-DD"))
					return
				}

				if (validateWith) {
					const checkOutDate = dayjs(getParam(validateWith) || "")
					if (!checkOutDate.isAfter(newDate)) {
						const nextDay = newDate.add(1, "day")
						setParam(validateWith, nextDay.format("YYYY-MM-DD"))
					}
				}
			}
			// For check-out date
			else {
				if (validateWith) {
					const checkInDate = dayjs(getParam(validateWith) || "")
					if (!newDate.isAfter(checkInDate)) {
						const nextDay = checkInDate.add(1, "day")
						setParam(paramName, nextDay.format("YYYY-MM-DD"))
						return
					}
				}
			}

			setParam(paramName, value)
		},
	})
}
