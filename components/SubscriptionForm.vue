<script setup>
const props = defineProps(["startStep"]);
const step = ref(props.startStep || 1);
const selectedPrice = ref(null);
const prices = ref([]);

onMounted(async () => {
  prices.value = await $fetch("/api/prices", {
    query: { type: "subscription" },
    key: `prices subscription`,
    headers: useRequestHeaders(["cookie"]),
  });

  if (prices.value.length === 1) selectedPrice.value = prices.value[0];
});

function nextStep() {
  step.value++;
}
</script>
<template>
  <div>
    <v-card v-if="step === 1">
      <v-card-title class="text-center mb-8">{{
        "Subscription and get access to unlimited AI generated content"
      }}</v-card-title>
      <v-card-text>
        <v-row v-if="prices.length">
          <v-col :cols="12 / prices.length" v-for="price in prices">
            <v-card
              class="mx-auto card-hover"
              :class="{
                'border-secondary': price.nickname === selectedPrice?.nickname,
              }"
              max-width="344"
              variant="outlined"
              :hover="true"
              @click="selectedPrice = price"
            >
              <v-card-item>
                <div>
                  <div class="text-overline mb-1">
                    {{ "Unlimited access" }}
                  </div>
                  <div class="text-h6 mb-1">
                    {{ price.unit_amount / 100 }}€
                    <span v-if="price.recurring"> / mois</span>
                  </div>
                  <div class="text-caption">
                    {{ price.nickname }}
                  </div>
                </div>
              </v-card-item>
              <v-card-actions v-if="prices.length > 1">
                <v-btn
                  color="secondary"
                  class="mx-auto"
                  :class="{
                    'opacity-1': price.nickname === selectedPrice?.nickname,
                  }"
                  size="large"
                  variant="plain"
                  >{{ "Select" }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-6">
        <v-btn
          @click="nextStep"
          color="secondary"
          class="mx-auto"
          size="large"
          variant="outlined"
          >{{ "Next" }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card v-if="step === 2">
      <UserProfilForm @next-step="step = 3" />
    </v-card>
    <PaymentByCard
      type="subscription"
      :amount="selectedPrice.unit_amount"
      :price-id="selectedPrice.id"
      v-if="step === 3 && selectedPrice"
    />
  </div>
</template>
