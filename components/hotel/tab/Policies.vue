<template>
	<div class="space-y-8">
		<div class="space-y-4">
			<h4 class="text-lg font-semibold text-gray-900">Cancellation Policy</h4>
			<div class="space-y-4">
				<div
					v-for="room in hotelData.rooms"
					:key="room.id"
					class="bg-accent flex flex-col gap-1 rounded-2xl p-4"
				>
					<h5 class="font-semibold">{{ room.room_type }}</h5>
					<p>
						<span class="text-muted-foreground">Penalty Description: </span>
						<span class="font-semibold">{{
							room.policy_info.penalty_description
						}}</span>
					</p>
				</div>
			</div>
		</div>
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
						<span class="size-1.5 rounded-full bg-gray-500"></span>
						{{ getPaymentMethodName(card.cardCode) || card.cardCode }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script setup>
defineProps({ hotelData: Object, getPaymentMethodName: Function })
</script>
