<template>
  <fieldset
    class="pb-3 rounded-lg border-solid border-thin"
    :style="{
      borderColor: `${GrayColors[500] as string} !important`,
      padding: slots?.title ? '' : '24px',
    }"
  >
    <legend
      v-if="!props.noTitle"
      class="bg-erp-gray-300 rounded-pill"
      :class="{
        'text-center': props.center,
      }"
      :style="{
        width: 'max-content !important',
        padding: slots?.title ? '6px 8px' : '2px 12px 3px',
      }"
    >
      <slot name="title">
        <span class="text-black text-body-2 font-weight-regular">
          {{ props.title }}
        </span>
      </slot>
    </legend>

    <slot />
  </fieldset>
</template>

<script setup lang="ts">
  import { GrayColors } from '~/constants/color.constants'

  const slots = useSlots()

  const props = withDefaults(
    defineProps<{
      title?: string
      center?: boolean
      noTitle?: boolean
    }>(),
    {
      center: false,
      noTitle: false,
    }
  )
</script>
