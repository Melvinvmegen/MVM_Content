<template>
  <v-text-field
    :rules="[
      (v) => !!v || 'Password is required',
      (v) => v.length >= 7 || 'Min 8 characters',
    ]"
    :value="password"
    hint="At least 8 characters"
    label="Password"
    required
    :type="showPassword ? 'text' : 'password'"
    counter
    @input="$emit('update:password', $event.target.value)"
  >
    <template v-slot:append-inner>
      <Icon
        @click="showPassword = !showPassword"
        :name="showPassword ? 'mdi:eye' : 'mdi:eye-off'"
        size="24"
      />
    </template>
  </v-text-field>
</template>
<script setup>
defineProps(['password'])
defineEmits(['update:password'])

const showPassword = ref(false)
</script>
