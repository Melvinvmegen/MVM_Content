<template>
  <div>
    <v-app>
      <v-app-bar class="px-8">
        <v-row justify="center" align="center">
          <v-col md="3" cols="6">
            <v-toolbar-title>
              <nuxt-link
                to="/"
                class="text-decoration-none"
                :class="[themeIsLight ? 'text-black' : 'text-white']"
              >
                <Icon name="⚡" size="24" class="mr-2" />
                Content
              </nuxt-link>
            </v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col xl="2" sm="5" cols="6">
            <v-row
              justify="end"
              align="center"
              class="flex-0-0"
              :class="{ 'mt-1 ma-sm-n3': !user }"
            >
              <v-row v-if="user" justify="end">
                <v-col cols="2" md="5">
                  <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                      <v-btn color="transparent" variant="flat" v-bind="props">
                        <span v-if="userStore.userProfile.tokens !== null" class="mr-4">🪙 {{ userStore.userProfile.tokens }}</span>
                        <Icon name="mdi-account" size="24" />
                      </v-btn>
                    </template>
                    <v-list>
                      <nuxtLink
                        class="text-decoration-none"
                        :class="[themeIsLight ? 'text-black' : 'text-white']"
                        to="/update-password"
                      >
                        <v-list-item>
                          <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item>
                      </nuxtLink>
                      <nuxtLink
                        class="text-decoration-none"
                        :class="[themeIsLight ? 'text-black' : 'text-white']"
                        to="/user/billing"
                      >
                        <v-list-item>
                          <v-list-item-title>Billing</v-list-item-title>
                        </v-list-item>
                      </nuxtLink>
                      <nuxtLink
                        class="text-decoration-none"
                        :class="[themeIsLight ? 'text-black' : 'text-white']"
                        to="/user/logout"
                      >
                        <v-list-item>
                          <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                      </nuxtLink>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="2" md="3">
                  <v-btn
                    color="transparent"
                    variant="flat"
                    @click="toggleNavigation"
                  >
                    <Icon name="mdi-menu" size="24" />
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="6">
                  <nuxtLink
                    to="/sign-in"
                    class="text-decoration-none"
                    :class="[themeIsLight ? 'text-black' : 'text-white']"
                    >Sign In</nuxtLink
                  >
                </v-col>
                <v-col cols="6">
                  <nuxtLink
                    to="/sign-up"
                    class="text-decoration-none"
                    :class="[themeIsLight ? 'text-black' : 'text-white']"
                    >Sign Up</nuxtLink
                  >
                </v-col>
              </v-row>

              <template v-if="smAndUp">
                <v-btn
                  color="transparent"
                  variant="flat"
                  icon
                  @click="toggleTheme"
                  v-if="themeIsLight"
                >
                  <Icon name="mdi:moon-waxing-crescent" size="24" />
                </v-btn>
                <v-btn
                  color="transparent"
                  variant="flat"
                  icon
                  @click="toggleTheme"
                  v-else
                >
                  <Icon name="mdi:white-balance-sunny" size="24" />
                </v-btn>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-app-bar>
      <v-navigation-drawer :model-value="showNavigation" v-if="user">
        <v-list>
          <div>
            <v-list-item
              :to="`/contents/${content?.name}`"
              v-for="content of contentStore.contents"
              class="px-0"
            >
              <span class="px-2">{{ content?.name }}</span>
              <Icon
                name="mdi:pen"
                size="24"
                @click.prevent="
                  showModal = true;
                  newContent.id = content.id;
                  newContent.name = content.name;
                "
              />
              <Icon
                name="mdi:delete"
                size="24"
                @click.prevent="deleteContent(content.id)"
              />
            </v-list-item>
            <v-divider />
          </div>
          <v-spacer />
          <v-list-item @click="showModal = true" class="px-0">
            <span class="px-2">
              <Icon name="mdi:plus" />
              <span class="ml-2">Add new content</span>
            </span>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="d-flex align-center">
        <v-container>
          <slot />
        </v-container>
      </v-main>

      <v-footer app elevation="5">
        <v-row
          no-gutters
          justify="center"
          class="text-overline font-weight-black"
        >
          <p class="my-auto">MVM</p>
          <v-spacer />
          <p class="my-auto">Powered by OpenAi</p>
          <Icon name="logos:openai-icon" />
        </v-row>
      </v-footer>
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular
          color="secondary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-snackbar
        v-for="[key, value] in messages"
        :key="key"
        :model-value="value"
        :color="value.type || 'info'"
        timeout="1000"
        location="top"
      >
        {{ value.message }}
      </v-snackbar>
    </v-app>
    <v-dialog v-model="showModal" width="600">
      <v-card>
        <v-form @submit.prevent="createEditContent">
          <v-card-title class="text-center">{{
            newContent.id ? "Edit a content" : "Create a new content"
          }}</v-card-title>
          <v-card-text class="mt-4">
            <v-row dense="dense" justify="center">
              <v-col cols="10">
                <v-text-field
                  class="form-control"
                  name="name"
                  label="Content name"
                  density="compact"
                  type="text"
                  v-model="newContent.name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-row dense="dense" justify="center">
              <v-col class="d-flex justify-center" cols="12" lg="8">
                <v-btn class="bg-secondary" type="submit">{{
                  newContent.id ? "Edit a content" : "Add a content"
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useTheme } from "vuetify";
import loading from "~/stores/loading";
import { messages, successMessage, errorMessage } from "~/stores/message";
import { useUserStore } from "~/stores/user";
import { useContentStore } from "~/stores/contents";
import { useDisplay } from "vuetify";

const { smAndUp } = useDisplay();
const user = useSupabaseUser();
const userStore = useUserStore();
const contentStore = useContentStore();
let newContent = reactive({
  id: null,
  name: "",
});
const showModal = ref(false);
const showNavigation = ref(false);
if (user.value) {
  await contentStore.getContents(user.value.id)
}

const route = useRoute();
useHead({
  titleTemplate: (title) =>
    title ? `MVM Content Generator - ${title}` : "MVM Content Generator",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [
    {
      name: "description",
      content: route.meta.description,
    },
    { name: "og:title", content: route.meta.title },
    { name: "og:type", content: "website" },
    { name: "og:url", content: "website" },
    {
      name: "og:description",
      content: route.meta.description,
    },
    { name: "og:image", content: "website" },
    { name: "og:image:alt", content: "MVM content generator" },
    { name: "og:image:width", content: "1280" },
    { name: "og:image:width", content: "675" },
  ],
});

const theme = useTheme();
const themeIsLight = computed(() => theme.global.name.value === "light");
function toggleTheme() {
  theme.global.name.value = themeIsLight.value ? "dark" : "light";
}

function toggleNavigation() {
  showNavigation.value = !showNavigation.value;
}

const router = useRouter();
const createEditContent = async () => {
  try {
    loading.value = true;
    if (newContent.id) {
      const { data } = await useFetch(`/api/contents/${newContent.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...newContent }),
        headers: useRequestHeaders(["cookie"]),
      });
      contentStore.updateContent(data.value);
      successMessage("Content edited successfully");
    } else {
      const { data } = await useFetch(`/api/contents`, {
        method: "POST",
        body: JSON.stringify({ name: newContent.name }),
        headers: useRequestHeaders(["cookie"]),
      });
      contentStore.addContent(data.value);
      router.push(`/contents/${data.value.name}`);
      successMessage("Content created successfully");
    }

    showModal.value = false;
    newContent.id = null;
    newContent.name = "";
  } catch (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  } finally {
    loading.value = false;
  }
};

const deleteContent = async (id) => {
  const result = confirm("Are you sure you want to delete this content?");
  if (!result) return (loading.value = true);
  try {
    await useFetch(`/api/contents/${id}`, {
      method: "DELETE",
      headers: useRequestHeaders(["cookie"]),
    });
    contentStore.removeContent(id);
    successMessage("Content deleted successfully");
  } catch (error) {
    console.error("error", error);
    errorMessage(error.message);
    return;
  } finally {
    loading.value = false;
  }
};
</script>
<style>
.v-card-title {
  word-wrap: normal !important;
  white-space: normal;
}

.position-absolute {
  position: absolute;
}

.bottom-0 {
  bottom: 0;
}
</style>
