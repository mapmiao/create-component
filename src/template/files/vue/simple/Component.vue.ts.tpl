<script setup lang="{{scriptLang}}">
export interface I{{componentName}}Props {
}

const props = defineProps<I{{componentName}}Props>()
</script>

<template>
  <div class="{{camelName}}">{{componentName}}</div>
</template>

<style lang="{{styleLang}}" scoped>
.{{camelName}} {
}
</style>