<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
        <Icon name="⚡" size="30" />
        <h1 class="text-h5">Welcome back</h1>
        <p>Sign in to your account</p>
        <br />
        <v-form @submit.prevent="login" v-model="valid">
          <v-row justify="center">
            <v-col cols="11" md="8">
              <v-text-field
                :rules="[(v) => !!v || 'Field is required']"
                v-model="email"
                label="Email"
                required
                variant="outlined"
                name="email"
              ></v-text-field>
              <p class="text-right">
                <nuxt-link to="reset-password" class="text-caption text-secondary"
                  >Forgot your password?</nuxt-link
                >
              </p>
              <password-field v-model:password="password"></password-field>
              <v-btn
                type="submit"
                color="secondary"
                class="mt-2"
                size="large"
                variant="outlined"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <br />
        <span
          >Don't have an account yet?
          <NuxtLink to="/sign-up" class="text-secondary">Sign Up Now</NuxtLink></span
        >
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { successMessage, errorMessage } from "~/stores/message";
import loading from "~/stores/loading";

const client = useSupabaseClient();
const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  loading.value = true;

  const { data, error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  }

  if (data?.session) {
    successMessage("Logged in successfully");
    router.push("/");
  }
};
</script>
