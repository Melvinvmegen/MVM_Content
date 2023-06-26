<script setup>
const modelValue = defineModel();
</script>
<template>
  <v-dialog v-model="modelValue" width="auto">
    <v-card class="py-10">
      <v-card-title class="text-h5 text-center">
        {{ "You've used all your tokens 😞" }}
      </v-card-title>
      <br />
      <v-row justify="center">
        <v-col cols="10">
          <v-card-subtitle class="text-h6"> </v-card-subtitle>
          <v-card-text>
            {{
              "It seems like you've used all your tokens... We've let you finish your previous completions but now you can't go further without it."
            }}
            <br />
            <br />
            {{ "If you want some more you can buy some in a few clicks!" }}
          </v-card-text>
          <v-row justify="center">
            <v-card-actions class="mt-4">
              <v-btn to="/user/billing"> {{ "Get some tokens!" }} </v-btn>
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
