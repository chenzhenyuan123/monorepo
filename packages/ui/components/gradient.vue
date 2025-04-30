<script setup>
const props = defineProps({
  small: {
    type: Boolean,
    default: false,
  },
  conic: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  }
})

</script>

<template>
  <span
    :class="
      [
        'gradient',
        conic ? 'glowConic' : undefined,
        small ? 'gradientSmall' : 'gradientLarge',
        props.class,
      ]
        .filter(Boolean)
        .join(' ')
    "
  />
</template>
