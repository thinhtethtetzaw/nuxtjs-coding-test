<template>
	<div class="space-y-6">
		<div class="rounded-2xl bg-gray-50 p-4">
			<div class="mb-4 flex items-center gap-3">
				<h4 class="text-lg font-semibold text-gray-900">Phone Numbers</h4>
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
						<p class="font-semibold text-gray-900">{{ phone.phoneNumber }}</p>
					</div>
					<a
						:href="'tel:' + phone.phoneNumber"
						class="bg-primary rounded-lg px-4 py-2 font-medium text-white transition-colors hover:bg-blue-400"
						>Call Now</a
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { PhoneIcon } from "lucide-vue-next"
defineProps({ hotelData: Object })
</script>
