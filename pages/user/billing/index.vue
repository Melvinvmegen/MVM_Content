<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
      <template v-if="store.userSubscription && !showPayment">
        <v-card v-if="store.userSubscription.status === 'VALIDATED'">
          <v-card-title class="text-center">{{
            "Your subscription's running, you're a champ!"
          }}</v-card-title>
          <v-card-text class="mt-4">
            <v-row dense="dense" justify="center">
              <v-col cols="10">
                <div>
                  {{
                    "You currently have access to unlimited AI generated content, feel free to let it flow!"
                  }}
                </div>
                <div>
                  {{ "Start date:" }} {{ store.userSubscription.startDate }}
                </div>
                <div>
                  {{ "Price:" }} {{ store.userSubscription.amount }}€ / mois
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-row dense="dense" justify="center">
              <v-col class="d-flex justify-center" cols="12" lg="8">
                <v-btn
                  class="bg-red"
                  @click="cancelSubscription(store.userSubscription.id)"
                  >{{ "Cancel subscription" }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="store.userSubscription.status === 'DRAFT'">
          <v-card-title class="text-center">{{
            "Your started a subscription but never had the chance to finish it!"
          }}</v-card-title>
          <v-card-text class="mt-4">
            <v-row dense="dense" justify="center">
              <v-col cols="10">
                <div>
                  {{
                    "If you're still onto it feel free to continue and get access to unlimited AI generated content"
                  }}
                </div>
                <div>
                  {{ "Price:" }} {{ store.userSubscription.amount }}€ / mois
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-row dense="dense" justify="center">
              <v-col class="d-flex justify-center" cols="12" lg="8">
                <v-btn @click="setupSubscriptionPayment" class="bg-secondary">{{
                  "Finish my subscription"
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="store.userSubscription.status === 'CANCELLED'">
          <v-card-title class="text-center">{{
            "Your subscription has been cancelled"
          }}</v-card-title>
          <v-card-text class="mt-4">
            <v-row dense="dense" justify="center">
              <v-col cols="10">
                <div>
                  {{
                    "Had a change of mind ? You can still pick up where you left it! feel free to subscribe to the best unlimited AI generated content!"
                  }}
                </div>
                <div>
                  {{ "Start date:" }} {{ store.userSubscription.startDate }}
                </div>
                <div>
                  {{ "End date:" }} {{ store.userSubscription.endDate }}
                </div>
                <div>
                  {{ "Price:" }} {{ store.userSubscription.amount }}€ / mois
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-row dense="dense" justify="center">
              <v-col class="d-flex justify-center" cols="12" lg="8">
                <v-btn @click="setupSubscriptionPayment" class="bg-secondary">{{
                  "Reactivate my subscription"
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="store.userSubscription.status === 'FAILED'">
          <v-card-title class="text-center">{{
            "Your subscription payment failed so we had to stop it!"
          }}</v-card-title>
          <v-card-text class="mt-4">
            <v-row dense="dense" justify="center">
              <v-col cols="10">
                <div>
                  {{
                    "Regulate your payment and we'll update you subscription accordingly :)"
                  }}
                </div>
                <div>
                  {{ "Start date:" }} {{ store.userSubscription.startDate }}
                </div>
                <div>
                  {{ "Price:" }} {{ store.userSubscription.amount }}€ / mois
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-row dense="dense" justify="center">
              <v-col class="d-flex justify-center" cols="12" lg="8">
                <v-btn @click="setupSubscriptionPayment" class="bg-secondary">{{
                  "Regulate payment"
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </template>
      <template v-else>
        <PaymentForm
          :selected-price="selectedPrice"
          v-if="paymentChoice === 'payment'"
        />
        <SubscriptionForm :start-step="startStep" v-else />
        <v-btn
          v-if="paymentChoice === 'payment'"
          @click="paymentChoice = 'subscription'"
          color="secondary"
          class="mx-auto w-100"
          size="large"
          variant="plain"
          >{{ "Payment par virement" }}</v-btn
        >
        <v-btn
          v-else
          @click="paymentChoice = 'payment'"
          color="secondary"
          class="mx-auto w-100"
          size="large"
          variant="plain"
          >{{ "Payment par carte" }}</v-btn
        >
      </template>
    </v-col>
  </v-row>
</template>

<script setup>
import loading from "~/stores/loading";
import { errorMessage } from "~/stores/message";
import { useUserStore } from "~/stores/user";

const store = useUserStore();
const paymentChoice = ref("payment");
const showPayment = ref(false);
const startStep = ref(null);

onMounted(async () => {
  if (!store.userProfile.SubscriptionId) return;
  loading.value = true;
  try {
    store.getUserSubscription(store.userProfile.SubscriptionId);
  } catch (error) {
    console.log("error", error);
    errorMessage(error);
  } finally {
    loading.value = false;
  }
});

async function cancelSubscription(subscriptionId) {
  if (!subscriptionId) return;
  loading.value = true;
  try {
    await store.cancelSubscription(subscriptionId);
  } catch (error) {
    console.log("error", error);
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

function setupSubscriptionPayment() {
  showPayment.value = true;
  paymentChoice.value = "subscription";
  startStep.value = 3;
}
</script>
<style>
.card-hover:hover {
  border-color: #f9d262;
}

.border-secondary {
  border-color: #f9d262 !important;
}

.opacity-1 {
  opacity: 1 !important;
}
</style>
