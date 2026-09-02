<script setup lang="{{scriptLang}}">
const props = defineProps()
</script>

<template>
  <div class="{{camelName}}">{{componentName}}</div>
</template>

<style lang="{{styleLang}}" scoped>
@import "./index.{{styleLang}}";
</style>