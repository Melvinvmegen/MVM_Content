import { reactive } from "vue";

interface Message {
  message: string;
  type: "success" | "error";
}

let messages = reactive(new Map<string, Message>());

function successMessage(message: string) {
  messages.set("success", { message, type: "success" })
}

function errorMessage(message: string) {
  messages.set("error", { message, type: "error" })
}

export { messages, successMessage, errorMessage };
