import prisma from "@/utils/prisma";

export default defineEventHandler(async (event) => {
  const { userProfile } = await readBody(event);
  try {
    if (!userProfile) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    await prisma.userProfiles.update({
      where: {
        id: userProfile.id,
      },
      data: {
        billingAddress: userProfile.billingAddress,
        billingZipCode: userProfile.billingZipCode,
        billingCity: userProfile.billingCity,
        billingCountry: userProfile.billingCountry,
      },
    });
  } catch (error) {
    console.log("error", error);
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return;
});
