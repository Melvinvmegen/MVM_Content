import { ref } from "vue";

interface Content {
  id: Number;
  created_at: Date;
  updated_at: Date;
  name: String;
  user_id: String;
}

export const useContentStore = defineStore("content", () => {
  const contents = ref<[] | Content[]>([]);
  const currentContent = ref<null | Content>();

  async function getContents(user_id: string) {
    const { data } = await useFetch("/api/contents", {
      key: `contents for ${user_id}`,
      headers: useRequestHeaders(["cookie"]),
    });

    if (data.value) {
      // @ts-ignore
      return (contents.value = data.value);
    }
  }

  function getCurrentContent(id: Number) {
    currentContent.value = contents.value.find((c: Content) => c.id == id)
  }

  function addContent(content: Content) {
    contents.value.push(content);
  }

  function updateContent(content: Content) {
    const foundContent = contents.value.find((c: Content) => c.id === content.id)
    if (foundContent) {
      foundContent.name = content.name;
    }
  }

  function removeContent(id: Number) {
    const index = contents.value.findIndex((c) => c.id === id);
    contents.value.splice(index, 1);
  }

  return {
    getContents,
    contents,
    getCurrentContent,
    currentContent,
    addContent,
    updateContent,
    removeContent,
  };
});
