import { Language } from '../../types';

/**
 * Vue 简单组件模板（单文件 SFC，内联 scoped 样式）
 */
export function createVueSimpleTemplate(
  componentName: string,
  language: Language,
  styleLang: string,
): string {
  const camel = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const scriptLang = language === 'ts' ? 'ts' : 'js';
  const propsBlock =
    language === 'ts'
      ? `export interface I${componentName}Props {
}

const props = defineProps<I${componentName}Props>()
`
      : `const props = defineProps()
`;

  return `<script setup lang="${scriptLang}">
${propsBlock}
</script>

<template>
  <div class="${camel}">${componentName}</div>
</template>

<style lang="${styleLang}" scoped>
.${camel} {
}
</style>
`;
}
