<script setup>
import loading from "~/stores/loading";
import { useUserStore } from "~/stores/user";

const emit = defineEmits("next-step")
const mutableUserProfile = ref(userStore.userProfile);

async function updateUserProfil() {
  if (!mutableUserProfile.value) return;
  loading.value = true;
  try {
    useUserStore().updateUserProfil(mutableUserProfile.value)
  } catch (error) {
    console.log("error", error);
    errorMessage(error);
  } finally {
    loading.value = false;
    emit("next-step")
  }
}
</script>

<template>
  <v-form @submit.prevent="updateUserProfil" v-model="valid">
    <v-card-title class="text-center mb-8">{{
      "Easy question how much tokens do you want?"
    }}</v-card-title>
    <v-card-text>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8">
          <v-row justify="center">
            <v-col cols="11" md="8">
              <v-text-field
                :rules="[(v) => !!v || 'Address is required']"
                v-model="mutableUserProfile.billingAddress"
                label="Address"
                required
                name="Address"
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'ZipCode is required']"
                v-model="mutableUserProfile.billingZipCode"
                label="ZipCode"
                required
                name="ZipCode"
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'City is required']"
                v-model="mutableUserProfile.billingCity"
                label="City"
                required
                name="City"
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'Country is required']"
                v-model="mutableUserProfile.billingCountry"
                label="Country"
                required
                name="Country"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-6">
      <v-btn
        type="submit"
        class="mx-auto"
        >{{ "Next" }}</v-btn
      >
    </v-card-actions>
  </v-form>
</template>
