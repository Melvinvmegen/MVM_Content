export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const { paymentIntentId } = getQuery(event);
  try {
    if (!paymentIntentId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const stripePaymentIntent: [] = await $fetch(
      `${runtimeConfig.basicAuthFinanceUrl}/payment-intents/${paymentIntentId}`,
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

    if (!stripePaymentIntent)
      throw createError({ statusCode: 404, message: "Not found" });

    return stripePaymentIntent;
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
