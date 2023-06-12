export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const {
    paymentMethodId,
    customerId,
    amount,
    billingAddress,
    billingCity,
    billingZipCode,
    billingCountry,
    priceId
  } = await readBody(event);
  let clientSecret;
  try {
    if (!paymentMethodId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    clientSecret = await $fetch(
      `${runtimeConfig.basicAuthFinanceUrl}/payment-intents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${runtimeConfig.basicAuthFinanceUser}:${runtimeConfig.basicAuthFinancePassword}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          paymentMethodId,
          customerId,
          amount,
          billingAddress,
          billingCity,
          billingZipCode,
          billingCountry,
          priceId
        }),
      }
    );
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return clientSecret;
});
