<script setup>
import { VueRecaptcha } from "vue-recaptcha";
import loading from "~/stores/loading";
const runtimeConfig = useRuntimeConfig();
const props = defineProps(["completion"])
const job = ref("javascript developer");
const doing = ref("coding");
const prompt = ref("");
const valid = ref(false);
const recaptcha = ref(null);

async function submit() {
  recaptcha.value.execute();
};

async function onCaptchaExpired() {
  recaptcha.value.reset();
};

const emit = defineEmits(["startCompletion"])
async function onCaptchaVerified(recaptchaToken) {
  recaptcha.value.reset();
  try {
    emit("startCompletion", prompt.value, recaptchaToken)
  } catch (error) {
    console.error("error", error);
  }
};
</script>
<template>
  <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
    <Icon name="⚡" size="30" />
    <h1 class="text-h5">Content generator</h1>
    <p>Generate content for SEO not bullshit just facts</p>
    <v-divider class="ma-8" />
    <v-form @submit.prevent="submit" v-model="valid">
      <v-text-field
        v-model="job"
        label="Job"
        class="mx-4"
        required
      ></v-text-field>
      <v-text-field
        v-model="doing"
        label="Doing"
        class="mx-4"
        required
      ></v-text-field>
      <v-textarea
        v-model="prompt"
        label="Instructions"
        class="mx-4"
        required
        counter
        auto-grow
        clearable
        :disabled="loading"
      ></v-textarea>
      <v-btn type="submit" :disabled="!valid" class="mt-2">{{
        props.completion.id ? "Régénérer une réponse" : "Générer une réponse"
      }}</v-btn>
      <vue-recaptcha
        size="invisible"
        @expired="onCaptchaExpired"
        @verify="onCaptchaVerified"
        ref="recaptcha"
        :sitekey="runtimeConfig.public.recaptchaSiteKey"
      />
    </v-form>
  </v-sheet>
</template>
