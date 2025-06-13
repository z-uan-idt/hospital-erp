<template>
  <v-sheet
    class="erp-upload-image d-flex flex-column align-center justify-center border-dashed border-md border-info rounded-lg border-opacity-100 position-relative overflow-hidden"
    elevation="0"
    :style="{
      width: imageSize,
      height: imageSize,
    }"
    @click="triggerFileInput"
  >
    <div
      class="d-flex align-center justify-center position-absolute top-0 right-0 w-100 h-100"
      :class="{ 'erp-upload-image-label flex-column': preview }"
    >
      <v-icon
        size="22"
        :class="{ 'me-3 ': !preview }"
        :color="preview ? 'white' : 'black'"
      >
        custom-upload
      </v-icon>

      <div
        class="text-center text-body-2"
        :class="{ 'mt-3': preview }"
      >
        <span> Tải lên <br v-if="!preview" />logo/<br v-if="preview" />ảnh <br v-if="!preview" />đại diện </span>
      </div>
      <v-btn
        v-if="preview"
        size="small"
        color="erp-error"
        class="mt-2"
        variant="flat"
        style="z-index: 3"
        @click.stop="onRemoveImage"
      >
        <template #prepend>
          <v-icon
            class="me-n2"
            size="24"
          >
            mdi-close
          </v-icon>
        </template>
      </v-btn>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="d-none"
      @change="onFileChange"
    />

    <v-img
      v-if="preview"
      :src="preview"
      class="erp-upload-image-preview position-absolute top-0 right-0 w-100 h-100"
      cover
    />
  </v-sheet>
</template>

<script setup lang="ts">
  import { BlueColors } from '~/constants/color.constants'

  type Props = {
    modelValue: File | null
    preview?: string | null
    size?: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    preview: null,
    size: 250,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: File | null): void
    (e: 'update:preview', value: boolean): void
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const preview = ref<string | null>(null)

  watchEffect(() => {
    emit('update:preview', !!props.preview)
    preview.value = props.preview
  })

  const imageSize = computed(() => {
    if (typeof props.size === 'number') {
      return `${props.size}px`
    }
    if (parseInt(props.size)) {
      return `${parseInt(props.size)}px`
    }
    return props.size
  })

  function triggerFileInput() {
    fileInput.value?.click()
  }

  function onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.value = e.target?.result as string
      }
      emit('update:modelValue', files[0])
      reader.readAsDataURL(files[0])
      emit('update:preview', true)
    }
  }

  function onRemoveImage() {
    preview.value = null
    emit('update:preview', false)
    emit('update:modelValue', null)
  }

  const backgroundActive = BlueColors[25]
</script>

<style lang="scss" scoped>
  .erp-upload-image {
    cursor: pointer;
    user-select: none;
    background-color: white;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: v-bind(backgroundActive);
    }

    &-preview {
      z-index: 1;
    }

    &-label {
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }
</style>
