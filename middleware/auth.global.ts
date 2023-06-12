import  { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const store = useUserStore();
  if (user.value?.id) {
    await store.getUserProfile(user.value.id);
  }
  if (user.value && ["/sign-in", "/sign-up"].includes(to.path)) {
    return abortNavigation();
  } 
  if (!user.value && !["/", "/sign-in", "/sign-up"].includes(to.path)) {
    return navigateTo("/sign-in");
  }
});
