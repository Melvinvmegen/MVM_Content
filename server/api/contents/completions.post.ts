import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { text, content_name, prompt } = await readBody(event);

  const content = await prisma.contents.findFirst({
    where: {
      name: content_name,
    },
  });

  if (!content) throw createError({ statusCode: 400, message: "Cannot find content" });

  if (content) {
    await prisma.completions.create({
      data: {
        text,
        content_id: content?.id,
        prompt,
      },
    });
  }

  return true;
});
