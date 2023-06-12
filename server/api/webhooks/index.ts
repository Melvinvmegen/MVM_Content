import prisma from "@/utils/prisma";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const headers = getHeaders(event);
  if (process.client || !headers.authorization) return;

  const base64Credentials = headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  if (
    username !== runtimeConfig.webhookUser ||
    password !== runtimeConfig.webhookPassword
  ) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { customerId, tokens, subscriptionId } = await readBody(event);

  const userProfile = await prisma.userProfiles.findUnique({
    where: {
      FinanceId: customerId,
    },
  });

  if (!userProfile)
    throw createError({ statusCode: 404, message: "Not found" });

  if (tokens) {
    await prisma.userProfiles.update({
      where: {
        FinanceId: customerId,
      },
      data: {
        tokens: (userProfile.tokens || 0) + Number(tokens.replace(/\s/g, "")),
      },
    });
  } else if (subscriptionId) {
    await prisma.userProfiles.update({
      where: {
        FinanceId: customerId,
      },
      data: {
        SubscriptionId: subscriptionId,
      },
    });
  }

  return;
});
