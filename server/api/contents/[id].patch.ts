import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { name } = await readBody(event);

  const content = await prisma.contents.update({
    where: {
      id: Number(event.context.params?.id),
    },
    data: {
      name,
    },
  });

  return {...content, id: Number(content.id)};
});
