import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const content = await prisma.contents.findFirst({
    where: {
      id: Number(event.context.params?.id),
    },
    include: {
      Completions: true,
    }
  });

  for (let completion of content?.Completions) {
    await prisma.completions.delete({
      where: {
        id: completion.id,
      },
    });
  }

  const deleted_content = await prisma.contents.delete({
    where: {
      id: Number(event.context.params?.id),
    },
  });

  return {...content, id: Number(deleted_content.id)};
});
