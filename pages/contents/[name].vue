<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="7">
      <PromptForm
        :completion="completion"
        @start-completion="
          (finalPrompt, recaptchaToken) =>
            streamCompletion(finalPrompt, recaptchaToken)
        "
      />
      <v-sheet
        elevation="5"
        class="pa-4 pa-sm-8 text-center position-relative mt-2"
      >
        <v-row class="w-100" id="control-bar" justify="center" align="center">
          <template v-if="completion">
            <template v-if="completionsLength > 1">
              <v-btn
                color="transparent"
                variant="flat"
                icon
                @click="currentCompletionIndex -= 1"
                :disabled="currentCompletionIndex === 0 || loading"
              >
                <Icon name="mdi:undo" size="24" />
              </v-btn>
              <v-btn
                icon
                color="transparent"
                variant="flat"
                @click="currentCompletionIndex += 1"
                :disabled="
                  currentCompletionIndex === props.completionsLength - 1 ||
                  loading
                "
              >
                <Icon name="mdi:redo" size="24" />
              </v-btn>
            </template>
            <v-btn
              color="transparent"
              variant="flat"
              icon
              @click="copyToClipboard"
              v-if="copied"
            >
              <Icon name="mdi:check" size="24" />
            </v-btn>
            <v-btn
              color="transparent"
              variant="flat"
              icon
              @click="copyToClipboard"
              v-else
              :disabled="loading"
            >
              <Icon name="mdi:content-copy" size="24" />
            </v-btn>
            <template v-if="completion.id">
              <v-btn
                color="transparent"
                variant="flat"
                icon
                @click="addCompletion"
                :disabled="loading"
              >
                <Icon name="mdi:plus" size="24" />
              </v-btn>
              <v-btn
                color="transparent"
                variant="flat"
                icon
                @click="createOrUpdateCompletion"
                :disabled="loading"
              >
                <Icon name="mdi:content-save" size="24" />
              </v-btn>
              <v-btn
                color="transparent"
                variant="flat"
                icon
                @click="deleteCompletion"
                :disabled="loading"
              >
                <Icon name="mdi:delete" size="24" />
              </v-btn>
            </template>
          </template>
          <template v-if="loadingCompletion">
            <div class="loader">
              <div class="circle" id="a"></div>
              <div class="circle" id="b"></div>
              <div class="circle" id="c"></div>
            </div>
          </template>
        </v-row>
      </v-sheet>
      <v-spacer />
      <CompletionForm
        :completion="completion"
        :loading-completion="loadingCompletion"
        @start-completion="
          (finalPrompt, recaptchaToken, mode) =>
            streamCompletion(finalPrompt, recaptchaToken, mode)
        "
      ></CompletionForm>
    </v-col>
    <v-btn
      color="transparent"
      v-scroll="onScroll"
      id="scroll-to-top-button"
      rounded="xl"
      @click="scrollTo"
      ><Icon name="mdi-arrow-up-bold-circle-outline" size="36"
    /></v-btn>
  </v-row>
</template>
<script setup>
import { successMessage, errorMessage } from "~/stores/message";
import loading from "~/stores/loading";
import completion from "~/stores/completions";
import { useUserStore } from "~/stores/user";
import { useContentStore } from "~/stores/contents";

const user = useSupabaseUser();
const route = useRoute();
const contentStore = useContentStore();
const storedRecaptchaToken = ref(null);
const currentCompletionIndex = ref(-1);
const completionsLength = computed(() => {
  return contentStore.getCurrentContent.value?.Completions?.length;
});

const contentName = route.params.name;
onMounted(async () => {
  const { data } = await useFetch(`/api/content/${contentName}`, {
    key: `content ${contentName} for ${user.value.id}`,
    headers: useRequestHeaders(["cookie"]),
  });

  content.value = data.value;
  currentCompletionIndex.value = completionsLength.value - 1;

  if (completionsLength.value > 0) {
    completion.value = content.value?.Completions[currentCompletionIndex.value];
    if (!/<\/?[a-z][\s\S]*>/i.test(completion.value.text)) {
      completion.value.text = completion.value.text.replace(
        /(\n+)([^\n]+)/g,
        "<p>$2</p>"
      );
    }
  }
});

watch(currentCompletionIndex, () => {
  completion.value = content.value?.Completions[currentCompletionIndex.value];
  if (!completion.value) return;
  if (!/<\/?[a-z][\s\S]*>/i.test(completion.value.text)) {
    completion.value.text = completion.value.text.replace(
      /(\n+)([^\n]+)/g,
      "<p>$2</p>"
    );
  }
});

function convertHTML(str) {
  if (!str) return "";
  const regex = /[&|<|>|"|']/g;
  const htmlString = str.replace(regex, function (match) {
    if (match === "&") {
      return "&amp;";
    } else if (match === "<") {
      return "&lt;";
    } else if (match === ">") {
      return "&gt;";
    } else if (match === '"') {
      return "&quot;";
    } else {
      return "&apos;";
    }
  });

  return htmlString;
}

async function addCompletion() {
  try {
    content.value.Completions.push({
      prompt: "",
      text: "",
    });
    currentCompletionIndex.value = currentCompletionIndex.value + 1;
  } catch (error) {
    console.error("error", error);
  } finally {
    completion.value.text = "";
    return;
  }
}

const loadingCompletion = ref(false);
async function streamCompletion(prompt, recaptchaToken, mode = "new") {
  if (!storedRecaptchaToken.value) {
    storedRecaptchaToken.value = recaptchaToken;
  }

  loadingCompletion.value = true;
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: useRequestHeaders(["cookie"]),
    body: JSON.stringify({
      contentName,
      prompt,
      recaptchaToken,
    }),
  });

  if (mode !== "edit") {
    completion.value.text = "";
  }

  const reader = response.body.getReader();
  return new ReadableStream({
    start(controller) {
      return pump();
      function pump() {
        return reader
          .read()
          .then(async ({ done, value }) => {
            const string = new TextDecoder().decode(value);
            if (!string) {
              errorMessage("Something went wrong, please try again");
              return;
            }

            if (string.includes("[DONE]")) {
              controller.close();
              loading.value = false;
              if (mode === "edit") {
                completion.value.text = completion.value.text.join(" ");
              }
              const { data } = await useFetch("/api/contents/completions", {
                method: "POST",
                headers: useRequestHeaders(["cookie"]),
                body: JSON.stringify({
                  text: completion.value.text,
                  prompt,
                  content_name: content.value.name,
                }),
              });

              await useUserStore().updateUserProfil(data.userProfile);
              if (data.value.content) {
                contentStore.addContent(data.value.content);
                contentStore.getCurrentContent(data.value.content.id);
              }
              successMessage(
                "The completion is done, you can now copy it to your clipboard"
              );
              loadingCompletion.value = false;
              return;
            }

            string
              .split("data:")
              .filter((a) => a)
              .forEach((str) => {
                const content = convertHTML(
                  JSON.parse(str.replaceAll("\n", ""))?.choices?.[0]?.delta
                    ?.content
                );
                if (content) {
                  if (mode === "edit" && completion.value.text) {
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
            errorMessage(error.message);
            controller.error(error);
          });
      }
    },
  });
}

async function createOrUpdateCompletion() {
  try {
    if (completion.value.id) {
      await fetch("/api/contents/completions", {
        method: "PATCH",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify({
          text: completion.value.text,
          prompt: completion.value.prompt,
          completion_id: completion.value.id,
        }),
      });
      successMessage("The completion is successfully updated");
    } else {
      await fetch("/api/contents/completions", {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify({
          text: completion.value.text,
          prompt: completion.value.prompt,
          completion_id: completion.value.id,
          content_name: contentStore.getCurrentContent.value.name,
        }),
      });
      successMessage("The completion is successfully created");
    }
  } catch (error) {
    console.error("error", error);
    errorMessage(error.message);
  }
}

async function deleteCompletion() {
  await fetch("/api/contents/completions", {
    method: "DELETE",
    headers: useRequestHeaders(["cookie"]),
    body: JSON.stringify({
      completion_id: completion.value.id,
    }),
  });

  content.value.Completions =
    contentStore.getCurrentContent.value.Completions.filter(
      (c) => c.id !== completion.value.id
    );

  currentCompletionIndex.value -= 1;

  successMessage("The completion is successfully deleted");
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

let scrollToTopButton;
let controlBar;
function onScroll() {
  if (!scrollToTopButton) {
    scrollToTopButton = document.getElementById("scroll-to-top-button");
    if (!scrollToTopButton) return;
  }
  const windowHeight = window.innerHeight;
  const divHeight = scrollToTopButton.offsetHeight;
  const midpoint = (windowHeight - divHeight) / 2;
  if (window.pageYOffset >= midpoint) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
}

function scrollTo() {
  if (!controlBar) {
    controlBar = document.getElementById("control-bar");
    if (!controlBar) return;
  }
  const windowHeight = window.innerHeight;
  const divHeight = scrollToTopButton.offsetHeight;
  const midpoint = (windowHeight - divHeight) / 2;
  window.scrollTo({
    top: midpoint,
    behavior: "smooth",
  });
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
.grecaptcha-badge {
  visibility: hidden;
}

#scroll-to-top-button {
  display: none; /* hide the button by default */
  position: fixed;
  bottom: 120px;
  right: 20px;
}

.loader {
  display: flex;
  justify-content: center;
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
