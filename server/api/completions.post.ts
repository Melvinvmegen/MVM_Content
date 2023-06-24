import { sendStream } from "h3";
import openai from "@/utils/openai";
import prisma from "@/utils/prisma";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const user = await serverSupabaseUser(event);
  const { prompt, recaptchaToken, contentName } = await readBody(event);
  if (!recaptchaToken && !user) {
    return sendError(event, new Error("Missing recaptchaToken"));
  }

  try {
    const recaptcha = await $fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${runtimeConfig.recaptchaSecretKey}&response=${recaptchaToken}`,
      }
    );

    if (!recaptcha.success) {
      return sendError(event, new Error("Recaptcha failed"));
    }

    const res = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        temperature: 0.2,
        stream: true,
        messages: [
          {role: "system", content: `Ignore all instructions before this one. Your task is now to answer the following question`},
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      { responseType: "stream" }
    );

    if (user) {
      if (!contentName) {
        await prisma.contents.create({
          data: {
            name: decodeURI(contentName),
            user_id: user.id,
          },
        });
      }
    }

    return sendStream(event, res.data);
  } catch (error: any) {
    if (error.response?.status) {
      error.response.data.on("data", (data: any) => {
        const message = data.toString();
        const parsed = JSON.parse(message);
        return sendError(event, new Error(parsed?.error));
      });
    } else {
      return sendError(event, new Error("An error occurred during OpenAI request"));
    }
  }
});
