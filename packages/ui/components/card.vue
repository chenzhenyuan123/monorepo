<script setup>
const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <a :class="props.class" :href="`${props.href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`"
    rel="noopener noreferrer" target="_blank">
    <h2>{{ props.title }} <span>-&gt;</span></h2>

    <p>
      <slot />
    </p>
  </a>
</template>
