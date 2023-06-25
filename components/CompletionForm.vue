<script setup>
import Editor from "@tinymce/tinymce-vue";
import { errorMessage } from "~/stores/message";
import loading from "~/stores/loading";

const emit = defineEmits(["startCompletion"])
const props = defineProps(["completion", "completionsCount"]);
const valid = ref(false);
const currentSelection = ref(null);
const showUserNeeded = ref(false);
const finalPrompt = computed(() => {
  return `${props.completion?.prompt} ${props.completion?.text}`;
});

function toggleUserNeed() {
  if (props.completionsCount >= 3) {
    return showUserNeeded.value = true;
  }
}

async function editCompletion() {
  if (toggleUserNeed()) return;
  // TODO : resolve recaptcha token
  try {
    emit("startCompletion", finalPrompt.value);
  } catch (error) {
    errorMessage(error);
  }
}

async function convertToMdFormat() {
  if (toggleUserNeed()) return;
  try {
    const prompt = `Convert this file text to markdown code : ${props.completion.text}`;
    emit("startCompletion", prompt);
  } catch (error) {
    errorMessage(error);
  }
}

async function makeThisMoreHuman() {
  if (toggleUserNeed()) return;
  currentSelection.value = window.getSelection().toString();
  if (!currentSelection.value.length) {
    errorMessage("There is currently no selection, please select some");
  }
  props.completion.text = props.completion.text.split(currentSelection.value);
  try {
    const finalPrompt = `Make this more human ${currentSelection.value}`;
    emit("startCompletion", finalPrompt, null, "edit");
  } catch (error) {
    errorMessage(error);
  }
}

async function translateToFrench() {
  if (toggleUserNeed()) return;
  try {
    const prompt = `translate this english documentation code to french while keeping the html intact and without translating the urls : ${props.completion.text}`;
    emit("startCompletion", prompt);
  } catch (error) {
    errorMessage(error);
  }
}
</script>
<template>
  <v-sheet
    elevation="5"
    class="pa-4 pa-sm-8 text-center position-relative"
  >
    <template v-if="loading">
      <div class="loader">
        <div class="circle" id="a"></div>
        <div class="circle" id="b"></div>
        <div class="circle" id="c"></div>
      </div>
    </template>
    <br />
    <template v-if="props.completion.text">
      <editor
        api-key="9uzkgopcfss96g36pohkqsneyzy3fk40krb1bu5s4uw2r64y"
        v-model="props.completion.text"
        cloud-channel="6"
        :disabled="loading"
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
        @click="editCompletion"
        :disabled="!valid"
        class="mt-2 ml-4"
        >{{ "Editer une réponse" }}</v-btn
      >
      <v-btn
        @click="makeThisMoreHuman"
        class="mt-2 mr-2"
        :disabled="!props.completion.text"
        >Make this more human</v-btn
      >
      <v-btn
        @click="convertToMdFormat"
        :disabled="!props.completion.text"
        class="mt-2"
        >Convert to MD</v-btn
      >
      <v-btn
        @click="translateToFrench"
        :disabled="!props.completion.text"
        class="mt-2"
        >Translate to French</v-btn
      >
    </template>
  </v-sheet>
  <DialogUserNeeded v-model="showUserNeeded" title="This is not part of the free usage.."/>
</template>
<style scoped>
.loader {
  width: 180px;
  height: 80px;
  margin: auto;
  display: flex;
  justify-content: flex-end;
}
.circle {
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  margin: 0 2px;
  animation: jump 1s linear infinite;
}

#b {
  animation-delay: 0.2s;
}
#c {
  animation-delay: 0.4s;
}

@keyframes jump {
  0% {
    margin-top: 0;
  }
  35% {
    margin-top: -5px;
  }
  70% {
    margin-top: 0px;
  }
}

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