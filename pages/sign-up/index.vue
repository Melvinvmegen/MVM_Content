<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
        <Icon name="⚡" size="30" />
        <h1 class="text-h5">Get started</h1>
        <p>Create a new account</p>
        <br />
        <v-form @submit.prevent="signUp" v-model="valid">
          <v-row justify="center">
            <v-col cols="11" md="8">
              <v-text-field
                :rules="[(v) => !!v || 'Firstname is required']"
                v-model="newUser.firstName"
                label="First name"
                required
                name="firstName"
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'Lastname is required']"
                v-model="newUser.lastName"
                label="Last name"
                required
                name="lastName"
              ></v-text-field>
              <v-text-field
                :rules="[(v) => !!v || 'Email is required']"
                v-model="newUser.email"
                label="Email"
                required
                name="email"
              ></v-text-field>
              <password-field v-model:password="newUser.password"></password-field>
              <v-btn
                type="submit"
                class="mt-2"
                :disabled="!valid"
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

const newUser = reactive({});
const router = useRouter();
const valid = ref(true);

const signUp = async () => {
  loading.value = true;
  try {
    const { data: user } = await useFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        ...newUser,
      }),
    });
    if (user.value?.identities?.length) {
      successMessage("Check your email for the confirmation link");
      router.push("/sign-up-confirmation");
    } else {
      successMessage("You already have an account, sign in!");
      router.push("/sign-in");
    }
  } catch (error) {
    console.error("error", error);
    errorMessage(error.message);
  } finally {
    loading.value = false;
  }
};
</script>
