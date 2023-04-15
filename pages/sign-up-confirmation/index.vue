<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="6">
      <v-sheet elevation="5" class="pa-8 text-center">
        <Icon name="⚡" size="30" />
        <h2 class="text-h5">Check you emails !</h2>
        <br />
        <p>
          We've sent you a confirmation link by email you just have to click on
          it 😉
        </p>
        <br />
        <p class="text-caption">
          If you didn't receive any email after 1 minute you can manually
          <a
            href=""
            class="text-decoration-underline"
            @click.prevent="resendConfirmationEmail"
            :disabled="disableResentButton"
            :class="[disableResentButton ? 'text-disabled' : 'text-secondary' ]"
            >resend a confirmation</a
          >.
        </p>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script setup>
import { successMessage, errorMessage } from "~/stores/message";

const router = useRouter();
const user = useSupabaseUser();
const disableResentButton = ref(true);
const currentTimeOut = ref(null);

watch(user, () => {
  if (user.value) router.push("/");
});

const enableButtonAfter1Minute = () => {
  currentTimeOut.value = setTimeout(() => {
    disableResentButton.value = false;
  }, 60000);
};

enableButtonAfter1Minute();

const resendConfirmationEmail = async () => {
  // TODO add resentConfirmationEmail when supabase supports it
  // const { data, error } = await client.auth.(
  //   user.value.id,
  //   {
  //     email: user.value.email,
  //   },
  //   {
  //     redirectTo: `${window.location.origin}/sign-in`,
  //   }
  // );

  if (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  }

  // if (data) {
  successMessage("Email confirmation successfully resent!");
  disableResentButton.value = true;
  // }
};

onUnmounted(() => {
  clearTimeout(currentTimeOut.value);
});
</script>
