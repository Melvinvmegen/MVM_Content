export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const { type } = getQuery(event);
  const priceIds = {
    payment: "prod_O6EFKBJoJJJrbd",
    subscription: "prod_O6EE4hgqAjqkFe",
  };

  try {
    if (!Object.keys(priceIds).includes(`${type}`)) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const stripePrices: [] = await $fetch(
      // @ts-ignore
      `${runtimeConfig.basicAuthFinanceUrl}/prices/${priceIds[`${type}`]}`,
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

    if (!stripePrices.length)
      throw createError({ statusCode: 404, message: "Not found" });

    return stripePrices;
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
