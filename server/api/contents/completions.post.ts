import { serverSupabaseUser } from "#supabase/server";
import prisma from "@/utils/prisma";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { text, content_name, prompt } = await readBody(event);

  let content;
  if (content_name) {
    content = await prisma.contents.findFirst({
      where: {
        name: content_name,
      },
    });
  }

  let contentIsNew = false;
  if (!content) {
    content = await prisma.contents.create({
      data: {
        name: uuidv4(),
        user_id: user.id,
      },
    });
    contentIsNew = true;
  }

  await prisma.completions.create({
    data: {
      text,
      content_id: content?.id,
      prompt,
    },
  });

  const userProfile = await prisma.userProfiles.update({
    where: {
      UserId: user.id,
    },
    data: {
      tokens: {
        decrement: text.match(/[\w\d\’\'-]+/gi)?.length || 0,
      },
    },
  });

  return {
    ...contentIsNew && {
      content: {
        ...content,
        id: Number(content.id),
      },
    },
    userProfile: {
      ...userProfile,
      id: Number(userProfile.id),
    },
  };
});
