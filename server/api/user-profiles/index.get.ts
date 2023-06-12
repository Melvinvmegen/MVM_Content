import prisma from "@/utils/prisma";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const response = await prisma.userProfiles.findFirst({
    where: {
      UserId: user.id,
    },
  });

  if (!response) throw createError({ statusCode: 404, message: "Not found" });

  const { UserId, ...userProfile} = response;

  return {
    ...userProfile,
    id: Number(userProfile.id)
  };
});
