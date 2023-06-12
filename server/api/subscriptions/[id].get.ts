export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  try {
    if (!event.context.params?.id) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const subscription = await $fetch(
      `${runtimeConfig.basicAuthFinanceUrl}/subscriptions/${event.context.params?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${runtimeConfig.basicAuthFinanceUser}:${runtimeConfig.basicAuthFinancePassword}`
          ).toString("base64")}`,
        },
      }
    );

    if (!subscription)
      throw createError({ statusCode: 404, message: "Not found" });

    return subscription;
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
