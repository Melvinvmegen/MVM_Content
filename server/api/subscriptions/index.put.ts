export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const { subscriptionId } = await readBody(event);
  try {
    if (!subscriptionId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const subscripton = await $fetch(
      `${runtimeConfig.basicAuthFinanceUrl}/subscriptions/${subscriptionId}/refund`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${runtimeConfig.basicAuthFinanceUser}:${runtimeConfig.basicAuthFinancePassword}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      }
    );
    // @ts-ignore
    return subscripton!.data;
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
