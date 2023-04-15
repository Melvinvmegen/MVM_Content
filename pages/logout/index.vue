<template></template>
<script setup>
import { successMessage } from "~/stores/message";
import loading from "~/stores/loading";
const client = useSupabaseClient();

onMounted(() => {
  loading.value = true;
  client.auth.signOut();
  loading.value = false;
  successMessage("Logged out successfully");
  window.location.href = "/";
});
</script>
