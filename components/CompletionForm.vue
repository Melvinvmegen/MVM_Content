<script setup>
import { VueRecaptcha } from "vue-recaptcha";
import Editor from "@tinymce/tinymce-vue";
import { errorMessage } from "~/stores/message";
import { useUserStore } from "~/stores/user";

const runtimeConfig = useRuntimeConfig();
const recaptcha = ref(null);
const user = useSupabaseUser();
const emit = defineEmits(["startCompletion"]);
const props = defineProps([
  "completion",
  "completionsCount",
  "loadingCompletion",
]);
const valid = ref(false);
const userStore = useUserStore();
const currentSelection = ref(null);
const showUserNeeded = ref(false);
const showTokensNeeded = ref(false);
const callerFunction = ref(null);
const finalPrompt = computed(() => {
  return `${props.completion?.prompt} ${props.completion?.text}`;
});

function toggleUserNeeded() {
  if (props.completionsCount >= 3 && !user.value) {
    return showUserNeeded.value = true;
  }
}

function toggleTokensNeeded() {
  if (
    user.value &&
    userStore.userProfile.tokens <= 0 &&
    !userStore.userProfile.SubscriptionId
  ) {
    return (showTokensNeeded.value = true);
  }
}

async function editCompletion(recaptchaToken) {
  callerFunction.value = "editCompletion"
  if (toggleUserNeeded()) return;
  if (toggleTokensNeeded()) return;
  if (!recaptchaToken) return recaptcha.value.execute();

  try {
    emit("startCompletion", finalPrompt.value, recaptchaToken);
  } catch (error) {
    errorMessage(error);
  }
}

async function convertToMdFormat(recaptchaToken) {
  callerFunction.value = "convertToMdFormat"
  if (toggleUserNeeded()) return;
  if (toggleTokensNeeded()) return;
  if (!recaptchaToken) return recaptcha.value.execute();

  try {
    const prompt = `Convert this file text to markdown code : ${props.completion.text}`;
    emit("startCompletion", prompt, recaptchaToken);
  } catch (error) {
    errorMessage(error);
  }
}

async function makeThisMoreHuman(recaptchaToken) {
  callerFunction.value = "makeThisMoreHuman"
  if (toggleUserNeeded()) return;
  if (toggleTokensNeeded()) return;
  if (!recaptchaToken) return recaptcha.value.execute();

  currentSelection.value = document
    .querySelector(".tox-tinymce")
    .querySelector("iframe")
    .contentWindow.getSelection()
    .toString();
  if (!currentSelection.value.length) {
    return errorMessage("There is currently no selection, please select some");
  }
  props.completion.text = props.completion.text.split(currentSelection.value);
  try {
    const finalPrompt = `Make this more human: ${currentSelection.value}`;
    emit("startCompletion", finalPrompt, recaptchaToken, "edit");
  } catch (error) {
    errorMessage(error);
  }
}

async function translateToFrench(recaptchaToken) {
  callerFunction.value = "translateToFrench"
  if (toggleUserNeeded()) return;
  if (toggleTokensNeeded()) return;
  if (!recaptchaToken) return recaptcha.value.execute();

  try {
    const prompt = `translate this english documentation code to french while keeping the html intact and without translating the urls : ${props.completion.text}`;
    emit("startCompletion", prompt, recaptchaToken);
  } catch (error) {
    errorMessage(error);
  }
}

async function onCaptchaExpired() {
  recaptcha.value.reset();
};
async function onCaptchaVerified(recaptchaToken) {
  recaptcha.value.reset();
  try {
    eval(`${callerFunction.value}('${recaptchaToken}')`);
  } catch (error) {
    console.error("error", error);
  }
};
</script>
<template>
  <v-sheet
    elevation="5"
    class="px-4 pb-4 px-sm-8 pb-sm-8 text-center position-relative"
  >
    <br />
    <template v-if="props.completion.text">
      <editor
        api-key="9uzkgopcfss96g36pohkqsneyzy3fk40krb1bu5s4uw2r64y"
        v-model="props.completion.text"
        cloud-channel="6"
        :disabled="loadingCompletion"
        :init="{
          menubar: false,
          toolbar_sticky: true,
          toolbar_sticky_offset: 64,
          allow_html_in_named_anchor: true,
          toolbar: `undo redo |
          blocks | fontfamily fontsize | bold italic forecolor | alignleft
          aligncenter alignright alignjustify | bullist numlist | lineheight
          outdent indent | copy | insertgroup | removeformat | searchreplace |
          wordcount | restoredraft | code`,
          font_family_formats: `Andale
          Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial
          Black=arial black,avant garde; Book Antiqua=book antiqua,palatino;
          Comic Sans MS=comic sans ms,sans-serif; Courier New=courier
          new,courier; Georgia=georgia,palatino; Helvetica=helvetica;
          Impact=impact,chicago; Oswald=oswald; Symbol=symbol;
          Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco;
          Times New Roman=times new roman,times; Trebuchet MS=trebuchet
          ms,geneva; Roboto=roboto; Verdana=verdana,geneva; Webdings=webdings;
          Wingdings=wingdings,zapf dingbats`,
          content_style: `@import
          url('https://fonts.googleapis.com/css2?family=Roboto:wght&display=swap');
          body { font-family: Roboto; }`,
          newline_behavior: 'linebreak',
          skin: 'oxide-dark',
          content_css: 'dark',
        }"
        plugins="lists codesample
          emoticons link searchreplace wordcount autosave code autoresize"
        selector="textarea"
        tag-name="div"
      />
      <v-divider class="my-4" />
      <v-btn
        v-if="props.completion.id"
        @click="editCompletion(recaptchaToken)"
        :disabled="!valid"
        class="mt-2 ml-4"
        >{{ "Editer une réponse" }}</v-btn
      >
      <v-btn
        @click="makeThisMoreHuman(recaptchaToken)"
        class="mt-2 mr-2"
        :disabled="!props.completion.text"
        >Make this more human</v-btn
      >
      <v-btn
        @click="convertToMdFormat(recaptchaToken)"
        :disabled="!props.completion.text"
        class="mt-2"
        >Convert to MD</v-btn
      >
      <v-btn
        @click="translateToFrench(recaptchaToken)"
        :disabled="!props.completion.text"
        class="mt-2"
        >Translate to French</v-btn
      >
      <vue-recaptcha
        size="invisible"
        @expired="onCaptchaExpired"
        @verify="onCaptchaVerified"
        ref="recaptcha"
        :sitekey="runtimeConfig.public.recaptchaSiteKey"
      />
    </template>
  </v-sheet>
  <DialogUserNeeded
    v-model="showUserNeeded"
    title="This is not part of the free usage.."
  />
  <DialogTokensNeeded v-model="showTokensNeeded" />
</template>
<style scoped>
.mce-content-body {
  border-color: white;
  border-width: 1px;
  padding: 5px;
  border-style: groove;
  border-radius: 3px;
  text-align: left;
}

.mce-content-body ul {
  margin-left: 30px;
}

.mce-content-body ol {
  margin-left: 30px;
}
</style>
