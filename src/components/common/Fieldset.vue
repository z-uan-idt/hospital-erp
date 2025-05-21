<template>
  <fieldset
    class="pa-6 pb-3 rounded-lg border-solid border-thin"
    :style="{
      borderColor: `${GrayColors[500] as string} !important`,
    }"
  >
    <legend class="font-weight-medium">
      <v-chip color="pmg-gray-700">
        <span class="text-black text-body-1">
          {{ title }}
        </span>
      </v-chip>
    </legend>

    <slot />
  </fieldset>
</template>

<script setup lang="ts">
  import { GrayColors } from '~/constants/color.constants'

  defineProps<{
    title: string
  }>()
</script>
