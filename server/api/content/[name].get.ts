import { serverSupabaseUser } from "#supabase/server";
import prisma from "@/utils/prisma";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const data = await prisma.contents.findFirst({
    where: {
      name: decodeURI(event.context.params?.name),
      users: {
        id: user.id,
      },
    },
    select: {
      name: true,
      Completions: {
        orderBy: {
          id: 'asc'
        }
      }
    },
  });

  if (!data) throw createError({ statusCode: 401, message: "Unauthorized" });

  return {
    ...data,
    Completions: data.Completions.map((completion) => ({
      ...completion,
      id: Number(completion.id),
      content_id: Number(completion.content_id),
    }))
  };
});
