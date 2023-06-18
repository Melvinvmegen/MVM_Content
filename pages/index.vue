<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <!-- <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
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
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="doing"
            label="Doing"
            class="mx-4"
            required
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="completion.prompt"
            label="Instructions"
            class="mx-4"
            required
            variant="outlined"
            counter
            auto-grow
            :disabled="loading"
          ></v-textarea>
          <v-btn
            type="submit"
            color="secondary"
            :disabled="!valid"
            class="mt-2"
            size="large"
            variant="outlined"
            >{{
              completion ? "Régénérer une réponse" : "Générer une réponse"
            }}</v-btn
          >
          <v-btn
            v-if="completion"
            @click="editCompletion"
            color="secondary"
            :disabled="!valid"
            class="mt-2 ml-4"
            size="large"
            variant="outlined"
            >{{ "Editer une réponse" }}</v-btn
          >
          <vue-recaptcha
            size="invisible"
            @expired="onCaptchaExpired"
            @verify="onCaptchaVerified"
            ref="recaptcha"
            :sitekey="runtimeConfig.public.recaptchaSiteKey"
          />
        </v-form>
      </v-sheet>
      <v-sheet elevation="5" class="pa-4 pa-sm-8 text-center">
        <v-row justify="center">
          <h2 class="text-h5">Response :</h2>
          <v-spacer />
          <template v-if="completion && !loading">
            <v-btn
              class="copy"
              icon
              @click="currentCompletionIndex -= 1"
              :disabled="currentCompletionIndex === 0"
            >
              <Icon name="mdi:undo" size="24" />
            </v-btn>
            <v-btn
              class="copy"
              icon
              @click="currentCompletionIndex += 1"
              :disabled="currentCompletionIndex === completionsLength - 1"
            >
              <Icon name="mdi:redo" size="24" />
            </v-btn>
          </template>
          <template v-if="completion && !loading">
            <v-btn class="copy" icon @click="copyToClipboard" v-if="copied">
              <Icon name="mdi:check" size="24" />
            </v-btn>
            <v-btn class="copy" icon @click="copyToClipboard" v-else>
              <Icon name="mdi:content-copy" size="24" />
            </v-btn>
            <v-btn
              class="copy"
              icon
              @click="updateCompletion"
              v-if="completion.text"
            >
              <Icon name="mdi:content-save" size="24" />
            </v-btn>
          </template>
          <template v-else-if="loading">
            <div class="loader">
              <div class="circle" id="a"></div>
              <div class="circle" id="b"></div>
              <div class="circle" id="c"></div>
            </div>
          </template>
        </v-row>
        <br />
        <template v-if="completion">
          <editor
            api-key="9uzkgopcfss96g36pohkqsneyzy3fk40krb1bu5s4uw2r64y"
            v-model="completion.text"
            cloud-channel="6"
            :disabled="loading"
            :inline="true"
            :init="{
              menubar: false,
              toolbar: `undo redo | blocks | fontfamily fontsize | bold italic forecolor |
                alignleft aligncenter alignright alignjustify | bullist numlist |
                lineheight outdent indent | copy | insertgroup | removeformat | searchreplace | wordcount | restoredraft | code`,
              font_family_formats: `Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; 
              Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; 
              Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; 
              Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; 
              Trebuchet MS=trebuchet ms,geneva; Roboto=roboto; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats`,
              content_style: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght&display=swap'); body { font-family: Roboto; }`,
              newline_behavior: 'linebreak',
            }"
            plugins="lists codesample emoticons link searchreplace wordcount autosave code"
            selector="textarea"
            tag-name="div"
          />
          <v-divider class="my-4" />
          <v-btn
            @click="makeThisMoreHuman"
            color="secondary"
            class="mt-2 mr-2"
            size="large"
            variant="outlined"
            >Make this more human</v-btn
          >
          <v-btn
            @click="convertToMdFormat"
            color="secondary"
            :disabled="!completion.text"
            class="mt-2"
            size="large"
            variant="outlined"
            >Convert to MD</v-btn
          >
          <v-btn
            @click="translateToFrench"
            color="secondary"
            :disabled="!completion.text"
            class="mt-2"
            size="large"
            variant="outlined"
            >Translate to French</v-btn
          >
          
        </template>
      </v-sheet> -->
    </v-col>
  </v-row>
</template>
<script setup>
import { successMessage, errorMessage } from "~/stores/message";
import { VueRecaptcha } from "vue-recaptcha";
import Editor from "@tinymce/tinymce-vue";

const user = useSupabaseUser();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const valid = ref(false);
const job = ref("javascript developer");
const doing = ref("coding");
const loading = ref(false);
// const addTitlesPrompt = "Rewrite this text with relevant titles";
// const questionPrompt =
//   "You must ALWAYS ask questions BEFORE you answer so you can better zone in on what the questioner is seek. Is that understood?";
const recaptcha = ref(null);
const storedRecaptchaToken = ref(null);
const content = ref(null);
const completion = ref({
  prompt: "",
  text: "",
});
const contentName = route.params.name;
const currentSelection = ref(null);
const currentCompletionIndex = ref(-1);
const completionsLength = computed(() => {
  return content.value?.Completions?.length;
});

if (user.value) {
  const { data } = await useFetch(`/api/content/${contentName}`, {
    key: `content ${contentName} for ${user.value.id}`,
    headers: useRequestHeaders(["cookie"]),
  });

  content.value = data.value;
  currentCompletionIndex.value = completionsLength.value - 1;

  if (completionsLength.value > 0) {
    completion.value = content.value?.Completions[currentCompletionIndex.value];
    if (!(/<\/?[a-z][\s\S]*>/i.test(completion.value.text))) {
      completion.value.text = completion.value.text.replace(
        /(\n+)([^\n]+)/g,
        "<p>$2</p>"
      );
    }
  }
}

watch(currentCompletionIndex, () => {
  completion.value = content.value?.Completions[currentCompletionIndex.value];
  if (!(/<\/?[a-z][\s\S]*>/i.test(completion.value.text))) {
    completion.value.text = completion.value.text.replace(
      /(\n+)([^\n]+)/g,
      "<p>$2</p>"
    );
  }
});

const submit = async () => {
  recaptcha.value.execute();
};

const finalPrompt = computed(() => {
  return `${completion.value?.prompt} ${completion.value?.text}`;
});

const onCaptchaVerified = async (recaptchaToken) => {
  storedRecaptchaToken.value = recaptchaToken;
  recaptcha.value.reset();

  try {
    await streamCompletion(finalPrompt.value, recaptchaToken);
  } catch (error) {
    console.error("error", error);
    errorMessage(error);
  } finally {
    completion.value.text = "";
    return;
  }
};

const editCompletion = async () => {
  try {
    await streamCompletion(finalPrompt.value, storedRecaptchaToken.value);
  } catch (error) {
    console.error("error", error);
    errorMessage(error);
  } finally {
    completion.value.text = "";
    return;
  }
};

const streamCompletion = async (prompt, recaptchaToken, mode = "new") => {
  loading.value = true;
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: useRequestHeaders(["cookie"]),
    body: JSON.stringify({
      contentName,
      prompt,
      recaptchaToken,
      job: job.value,
      doing: doing.value,
    }),
  });

  const reader = response.body.getReader();
  return new ReadableStream({
    start(controller) {
      return pump();
      function pump() {
        return reader
          .read()
          .then(async ({ done, value }) => {
            const string = new TextDecoder().decode(value);
            if (string.includes("[DONE]")) {
              controller.close();
              loading.value = false;
              if (mode === "edit") {
                completion.value.text = completion.value.text.join(" ");
              }
              await fetch("/api/contents/completions", {
                method: "POST",
                headers: useRequestHeaders(["cookie"]),
                body: JSON.stringify({
                  text: completion.value.text,
                  prompt: completion.value.prompt,
                  content_name: content.value.name,
                }),
              });
              successMessage("The completion is done, you can now copy it to your clipboard");
              return;
            }

            string
              .split("data:")
              .filter((a) => a)
              .forEach((str) => {
                const content = JSON.parse(str.replaceAll("\n", ""))
                  ?.choices?.[0]?.delta?.content;
                if (content) {
                  if (mode === "edit") {
                    completion.value.text[0] += content;
                  } else {
                    completion.value.text += content;
                  }
                }
              });

            controller.enqueue(value);
            return pump();
          })
          .catch((error) => {
            console.error("An error occurred during OpenAI request", error);
            errorMessage(error);
            controller.error(error);
          })
          .finally(async () => {
            loading.value = false;
          });
      }
    },
  });
};

const updateCompletion = async () => {
  try {    
    await fetch("/api/contents/completions", {
      method: "PATCH",
      headers: useRequestHeaders(["cookie"]),
      body: JSON.stringify({
        text: completion.value.text,
        prompt: completion.value.prompt,
        completion_id: completion.value.id,
      }),
    });
    successMessage("The completion has been updated");
  } catch (error) {
    errorMessage(error);
    console.error("error", error);
  }
};

const convertToMdFormat = async () => {
  try {
    const convertToMdPrompt = "Convert this file text to markdown code :";
    const prompt = `${convertToMdPrompt} ${completion.value.text}`;
    await streamCompletion(prompt, storedRecaptchaToken.value);
  } catch (error) {
    errorMessage(error);
    console.error("error", error);
  } finally {
    completion.value.text = "";
    return;
  }
};

const makeThisMoreHuman = async () => {
  currentSelection.value = window.getSelection().toString();
  if (!currentSelection.value.length) {
    return errorMessage("There is currently no selection, please select some");
  }
  completion.value.text = completion.value.text.split(currentSelection.value);
  try {
    const finalPrompt = `Make this more human ${currentSelection.value}`;
    await streamCompletion(finalPrompt, storedRecaptchaToken.value, "edit");
  } catch (error) {
    console.error("error", error);
    errorMessage(error);
  } finally {
    return;
  }
};

const translateToFrench = async () => {
  try {
    const translationPrompt = "translate this english documentation code to french while keeping the html intact and without translating the urls :";
    const prompt = `${translationPrompt} ${completion.value.text}`;
    await streamCompletion(prompt, storedRecaptchaToken.value);
  } catch (error) {
    console.error("error", error);
    errorMessage(error);
  } finally {
    completion.value.text = "";
    return;
  }
}

const copied = ref(false);
const timeout_id = ref(null);
function copyToClipboard() {
  navigator.clipboard.writeText(completion.value.text).then(() => {
    copied.value = true;

    clearTimeout(timeout_id.value);
    timeout_id.value = setTimeout(() => (copied.value = false), 2000);
  });
}

const onCaptchaExpired = () => {
  recaptcha.value.reset();
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
/* .grecaptcha-badge { visibility: hidden; } */

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
</style>
