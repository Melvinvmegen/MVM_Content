import { Configuration, OpenAIApi } from "openai";

const runtimeConfig = useRuntimeConfig();
const configuration = new Configuration({
  apiKey: runtimeConfig.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

export default openai;