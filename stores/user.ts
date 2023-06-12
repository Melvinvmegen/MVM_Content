export const useUserStore = defineStore("user", () => {
  const userProfile = ref<{
    id: string | null;
    FinanceId: string | null;
    SubscriptionId: string | null;
  }>({
    id: null,
    FinanceId: null,
    SubscriptionId: null,
  });
  const userSubscription = ref(null);

  async function getUserProfile(user_id: string) {
    userProfile.value = await $fetch("/api/user-profiles", {
      key: `user profile for ${user_id}`,
      headers: useRequestHeaders(["cookie"]),
    });
  }

  async function updateUserProfil(mutableUserProfile: any) {
    if (!mutableUserProfile) return;
    await useFetch("/api/user-profiles", {
      method: "PUT",
      body: JSON.stringify({
        userProfile: mutableUserProfile,
      }),
      headers: useRequestHeaders(["cookie"]),
    });
  }

  async function getUserSubscription(subscriptionId: number) {
    if (!subscriptionId) return;
    const response: any = await $fetch(`/api/subscriptions/${subscriptionId}`, {
      key: `subscriptions ${subscriptionId}`,
      headers: useRequestHeaders(["cookie"]),
    });

    userSubscription.value = response;
  }

  async function cancelSubscription(subscriptionId: number) {
    if (!subscriptionId) return;
    const response: any = await useFetch("/api/subscriptions", {
      method: "PUT",
      body: JSON.stringify({
        subscriptionId: subscriptionId,
      }),
    });

    userSubscription.value = response;
  }

  return {
    userProfile,
    getUserProfile,
    updateUserProfil,
    userSubscription,
    getUserSubscription,
    cancelSubscription,
  };
});
