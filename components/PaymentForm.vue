<script setup>
const step = ref(1);
const selectedPrice = ref(null);
const prices = ref([]);
const priceNames = ["Noob", "Advanced", "Harcore"];

onMounted(async () => {
  const response = await $fetch("/api/prices", {
    query: { type: "payment" },
    key: `prices payment`,
    headers: useRequestHeaders(["cookie"]),
  });
  prices.value = response.sort((price, nextPrice) => {
    return price.unit_amount - nextPrice.unit_amount;
});
});
</script>
<template>
  <v-card v-if="step === 1">
    <v-card-title class="text-center mb-8">{{
      "Easy question how much tokens do you want?"
    }}</v-card-title>
    <v-card-text>
      <v-row v-if="prices.length">
        <v-col sm="4" cols="12" v-for="(price, index) in prices">
          <v-card
            class="mx-auto card-hover"
            :class="{
              'border-secondary': price.id === selectedPrice?.id,
            }"
            max-width="344"
            variant="outlined"
            :hover="true"
            @click="selectedPrice = price"
          >
            <v-card-item>
              <div>
                <div class="text-overline mb-1 text-center text-sm-left">
                  {{ priceNames[index] }}
                </div>
                <div class="text-h6 mb-1 text-center text-sm-left">{{ price.unit_amount / 100 }}€</div>
                <div class="text-caption text-center text-sm-left">
                  {{ price.nickname }}
                </div>
              </div>
            </v-card-item>
            <v-card-actions>
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
    <v-card-actions class="my-3">
      <v-btn
        @click="step = 2"
        color="secondary"
        class="mx-auto"
        size="large"
        variant="outlined"
        >{{ "Next" }}</v-btn
      >
    </v-card-actions>
  </v-card>
  <v-card v-if="step === 2">
    <UserProfilForm @next-step="step = 3"/>
  </v-card>
  <PaymentByCard type="payment" :amount="selectedPrice.unit_amount" :price-id="selectedPrice.id" v-if="step === 3" />
</template>
