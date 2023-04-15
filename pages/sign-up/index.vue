<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="6">
      <v-sheet elevation="5" class="pa-8 text-center">
        <Icon name="⚡" size="30" />
        <h1 class="text-h5">Get started</h1>
        <p>Create a new account</p>
        <br />
        <v-form @submit.prevent="signUp" v-model="valid">
          <v-row justify="center">
            <v-col cols="8">
              <v-text-field
                :rules="[(v) => !!v || 'Email is required']"
                v-model="email"
                label="Email"
                required
                variant="outlined"
                name="email"
              ></v-text-field>
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
          <NuxtLink to="/sign-in">Sign in Now</NuxtLink></span
        >
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { successMessage, errorMessage } from "~/stores/message";
import loading from "~/stores/loading";

const client = useSupabaseClient();
const user = useSupabaseUser();
const email = ref("");
const password = ref("");
const router = useRouter();

onMounted(() => {
  if (user.value) router.push("/");
});

const signUp = async () => {
  loading.value = true;
  const { data, error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  }

  successMessage("Check your email for the confirmation link");
  if (data?.user?.identities?.length) {
    router.push("/sign-up-confirmation");
  } else if (!error) {
    router.push("/sign-in");
  }
};
</script>
