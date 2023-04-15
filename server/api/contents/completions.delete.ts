import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { completion_id } = await readBody(event);

  await prisma.completions.delete({
    where: {
      id: BigInt(completion_id),
    },
  });

  return true;
});
