<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="6">
      <v-sheet elevation="5" class="pa-8 text-center">
        <Icon name="⚡" size="30" />
        <h1 class="text-h5">Reset password</h1>
        <p>Feel free to keep it somewhere safe</p>
        <br />
        <v-form @submit.prevent="updatePassword" v-model="valid">
          <v-row justify="center">
            <v-col cols="8">
              <password-field v-model:password="password"></password-field>
              <v-btn
                type="submit"
                color="secondary"
                class="mt-2"
                size="large"
                variant="outlined"
                >Change my password</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import loading from "~/stores/loading";
import { successMessage, errorMessage } from "~/stores/message";

const client = useSupabaseClient();
const user = useSupabaseUser();
const password = ref("");
const router = useRouter();

onMounted(() => {
  if (!user.value) router.push("/sign-in");
});

const updatePassword = async () => {
  loading.value = true;
  const { data, error } = await client.auth.updateUser({
    password: password.value,
  });

  loading.value = false;

  if (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  }

  successMessage("Password updated successfully");
};
</script>
