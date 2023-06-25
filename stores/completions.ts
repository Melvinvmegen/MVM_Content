import { ref } from "vue";

interface Completion {
    prompt: string;
    text: String;
  }
const completion = ref<null | Completion>((process.client && JSON.parse(localStorage?.getItem("completion"))) || {
    prompt: "",
    text: "",
  });

export default completion;