import { serverSupabaseUser } from "#supabase/server";
import prisma from "@/utils/prisma";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { text, completion_id, prompt } = await readBody(event);

  const initial_completion = await prisma.completions.findFirst({
    where: {
      id: BigInt(completion_id),
    },
  });

  if (!initial_completion)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  await prisma.completions.update({
    where: {
      id: BigInt(completion_id),
    },
    data: {
      text,
      prompt,
    },
  });

  return true;
});
