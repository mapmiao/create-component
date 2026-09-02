<script setup lang="{{scriptLang}}">
import { {{hookName}} } from './composable/{{hookName}}'
const props = defineProps()
const { count, handleClick } = {{hookName}}(props)
</script>

<template>
  <div class="{{camelName}}" @click="handleClick">
    <span>{{componentName}} ({{ count }})</span>
  </div>
</template>

<style lang="{{styleLang}}" scoped>
@import "./index.{{styleLang}}";
</style>