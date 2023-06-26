<script setup>
const modelValue = defineModel();
const { title = "You've completed your free usage" } = defineProps({
  title: {
    type: String,
  },
});
</script>
<template>
  <v-dialog v-model="modelValue" width="auto">
    <v-card class="py-10">
      <v-card-title class="text-h5 text-center">
        {{ title }}
      </v-card-title>
      <br />
      <v-row justify="center">
        <v-col cols="5">
          <v-card-subtitle class="text-h6">
            You already have an account?
          </v-card-subtitle>
          <v-card-text>
            Login and buy or spend some tokens to get the completion you wanted!
          </v-card-text>
          <v-row justify="center">
            <v-card-actions class="mt-4">
              <v-btn to="/sign-in"> Login </v-btn>
            </v-card-actions>
          </v-row>
        </v-col>
        <span style="border-left: white 2px solid"></span>
        <v-col cols="5">
          <v-card-subtitle class="text-h6">
            You don't have an account yet?
          </v-card-subtitle>
          <v-card-text>
            Sign up and get some free tokens you can then spend to get the
            completion you wanted!
          </v-card-text>
          <v-row justify="center">
            <v-card-actions class="mt-4">
              <v-btn to="/sign-up"> Sign up </v-btn>
            </v-card-actions>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.top-5 {
  top: 5px;
}
.right-0 {
  right: 0;
}
</style>
