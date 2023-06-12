<template>
  <v-row justify="center" v-if="paymentIntent">
    <v-col cols="12" md="8" lg="6">
      <v-sheet elevation="5" class="pa-8 text-center" v-if="paymentIntent.status === 'DRAFT'">
        <Icon name="mdi:clock" size="30" />
        <h2 class="text-h5">
          Your payment is currently being processed
        </h2>
        <br />
        <p>
          Wait a few minutes and come back we're working on it 😉!
        </p>
        <br />
        <p class="text-caption">
          If you're sure the payment did pass you can refresh after a few seconds!
          <a
            href=""
            class="text-decoration-underline"
            @click.prevent="loadPaymentIntent"
            :disabled="disableResentButton"
            :class="[disableResentButton ? 'text-disabled' : 'text-secondary']"
            >Refresh</a
          >.
        </p>
      </v-sheet>
      <v-sheet elevation="5" class="pa-8 text-center" v-if="paymentIntent.status === 'CAPTURED'">
        <Icon name="⚡" size="30" />
        <template v-if="paymentIntent.type === 'payment'">
        <h2 class="text-h5">
          Your payment has been validated!
        </h2>
        <br />
        <p>
          You can now freely use the service up to every last token you got!
        </p>
      </template>
      <template v-else>
        <h2 class="text-h5">
          Your subscription is now activated !
        </h2>
        <br />
        <p >
          You can now freely use the service!
        </p>
      </template>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script setup>
import loading from "~/stores/loading";
import { errorMessage } from "~/stores/message";

const route = useRoute();
const paymentIntent = ref(null);
const disableResentButton = ref(false);
const currentTimeOut = ref(null);

async function loadPaymentIntent() {
  if (disableResentButton.value) return;
  loading.value = true;
  try {
    paymentIntent.value = await $fetch("/api/payment-intents", {
      query: { paymentIntentId: route.query.payment_intent },
      key: `paymentIntent ${route.query.payment_intent}`,
      headers: useRequestHeaders(["cookie"]),
    });
  } catch (error) {
    console.log("error", error);
    errorMessage(error);
  } finally {
    disableResentButton.value = true;
    loading.value = false;
  }
}

onMounted(async () => {
  loadPaymentIntent()
});

function enableButtonAfter1Minute () {
  currentTimeOut.value = setTimeout(() => {
    disableResentButton.value = false;
  }, 60000);
};

enableButtonAfter1Minute();

onUnmounted(() => {
  clearTimeout(currentTimeOut.value);
});
</script>
