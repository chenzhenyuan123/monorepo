<script setup name="Join">
const route = useRoute();
definePageMeta({
  layout: 'noside'
})
const isSingle = ref(route.query?.store)
// const isMultiple = ref(route.query?.share)
</script>
<template>
  <JoinSingle v-if="isSingle"></JoinSingle>
  <JoinMultiple v-else></JoinMultiple>
</template>