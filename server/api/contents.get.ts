import { serverSupabaseUser } from "#supabase/server";
import prisma from "@/utils/prisma";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const data = await prisma.contents.findMany({
    where: {
      users: {
        id: user.id,
      },
    },
  });

  return data.map((content) => ({...content, id: Number(content.id)}));
});
