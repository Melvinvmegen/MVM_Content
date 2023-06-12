<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="6">
      <v-sheet elevation="5" class="pa-8 text-center">
        <Icon name="⚡" size="30" />
        <h1 class="text-h5">Reset your password</h1>
        <p>
          Type in your email and we'll send you a link to reset your password
        </p>
        <br />
        <v-form @submit.prevent="resetPassword" v-model="valid">
          <v-row justify="center">
            <v-col cols="8">
              <v-text-field
                :rules="[(v) => !!v || 'Field is required']"
                v-model="email"
                label="Email"
                required
                variant="outlined"
                name="email"
              ></v-text-field>
              <v-btn
                type="submit"
                color="secondary"
                class="mt-2"
                size="large"
                variant="outlined"
                >Send reset email</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <br />
        <span
          >You remember your password?
          <NuxtLink to="/sign-in">Sign In</NuxtLink></span
        >
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { successMessage, errorMessage } from "~/stores/message";
import loading from "~~/stores/loading";

const client = useSupabaseClient();
const email = ref("");
const router = useRouter();

const resetPassword = async () => {
  loading.value = true;
  const { error } = await client.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  loading.value = false;
  if (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  }
  
  successMessage("Check your email for a link to reset your password");
  router.push("/sign-in");
};
</script>
