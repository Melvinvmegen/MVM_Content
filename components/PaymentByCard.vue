<script setup>
import loading from "~/stores/loading";
import { errorMessage } from "~/stores/message";
import { loadStripe } from "@stripe/stripe-js";
import { useUserStore } from "~/stores/user";

const runtimeConfig = useRuntimeConfig();
const store = useUserStore();
const stripe = await loadStripe(runtimeConfig.public.stripePublicKey);
let elements;
let form;
let submitBtn;
const props = defineProps(["type", "amount", "priceId"]);

onMounted(async () => {
  if (process.client) {
    loading.value = true;

    const options = {
      amount: props.amount,
      mode: props.type,
      paymentMethodCreation: "manual",
      currency: "eur",
      // TODO: custom appearance
      appearance: {
        /*...*/
      },
    };
    elements = stripe.elements(options);

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
    form = document.getElementById("payment-form");
    submitBtn = document.getElementById("submit");
    form.addEventListener("submit", handleFormSubmission);
    loading.value = false;
  }
});

async function handleFormSubmission(event) {
  loading.value = true;
  event.preventDefault();
  if (submitBtn?.disabled) {
    return;
  }
  submitBtn.disabled = true;

  const { error: submitError } = await elements.submit();
  if (submitError) {
    handleError(submitError);
    return;
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    elements,
    params: {
      billing_details: {
        name: `${store.userProfile.firstName} ${store.userProfile.lastName}`,
        address: {
          city: store.userProfile.billingCity,
          country: store.userProfile.billingCountry,
          line1: store.userProfile.billingAddress,
          line2: null,
          postal_code: store.userProfile.billingZipCode,
          state: null,
        },
      },
    },
  });

  if (error) {
    handleError(error);
    return;
  }

  const { data: paymentIntent } = await useFetch(
    `/api/${props.type === "payment" ? "payment-intents" : "subscriptions"}`,
    {
      method: "POST",
      body: JSON.stringify({
        amount: props.amount,
        customerId: store.userProfile.FinanceId,
        paymentMethodId: paymentMethod.id,
        billingAddress: store.userProfile.billingAddress,
        billingCity: store.userProfile.billingCity,
        billingZipCode: store.userProfile.billingZipCode,
        billingCountry: store.userProfile.billingCountry,
        priceId: props.priceId,
      }),
    }
  );

  handleServerResponse(paymentIntent.value);
}

function handleError(error) {
  const messageContainer = document.querySelector("#error-message");
  messageContainer.textContent = error.message;
  errorMessage(error.message);
  submitBtn.disabled = false;
  loading.value = false;
}

const handleServerResponse = async (clientSecret) => {
  const { error } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/success`,
    },
  });

  if (error) {
    handleError(error);
    return;
  }
};
</script>
<template>
  <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
    <Icon name="⚡" size="30" />
    <template v-if="props.type === 'payment'">
      <h1 class="text-h5">Buy some tokens</h1>
      <p>Get access to the best AI generated content!</p>
    </template>
    <template v-else>
      <h1 class="text-h5">Subscribe</h1>
      <p>Get unlimited access to AI generated content!</p>
    </template>
    <br />
    <v-row justify="center">
      <v-col cols="11" md="8">
        <form id="payment-form">
          <div id="payment-element"></div>
          <button
            class="v-btn v-btn--elevated v-theme--dark v-btn--density-default v-btn--size-default v-btn--variant-elevated bg-secondary mt-4"
            id="submit"
          >
            Submit
          </button>
          <div id="error-message"></div>
        </form>
      </v-col>
    </v-row>
  </v-sheet>
</template>
