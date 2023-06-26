import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/utils/prisma";



export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const client = serverSupabaseClient(event);
  const { email, password, firstName, lastName } = await readBody(event);
  let user;
  try {
    const { data, error } = await client.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("error", error);
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    if (data.user?.id) {
      // @ts-ignore
      user = data.user;
      const customer: { id: number } = await $fetch(
        `${runtimeConfig.basicAuthFinanceUrl}/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${runtimeConfig.basicAuthFinanceUser}:${runtimeConfig.basicAuthFinancePassword}`
            ).toString("base64")}`,
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        }
      );

      await prisma.userProfiles.create({
        data: {
          firstName,
          lastName,
          UserId: data.user?.id,
          FinanceId: customer.id,
          tokens: 100000
        },
      });
    }
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return user;
});
