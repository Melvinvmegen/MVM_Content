import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { name } = await readBody(event);

  const content = await prisma.contents.create({
    data: {
      name,
      user_id: user.id,
    },
  });

  return {...content, id: Number(content.id)};
});
