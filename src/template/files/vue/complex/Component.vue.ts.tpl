<script setup lang="{{scriptLang}}">
import { {{hookName}} } from './composable/{{hookName}}'
export interface I{{componentName}}Props {
}

const props = defineProps<I{{componentName}}Props>()
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