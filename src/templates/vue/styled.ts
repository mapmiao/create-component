import { Language } from '../../types';

/**
 * Vue 带样式组件：主 SFC 模板
 * 样式抽到独立外部样式文件（index.scss / index.less），通过 scoped <style> @import 引入
 */
export function createVueStyledTemplate(
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
@import "./index.${styleLang}";
</style>
`;
}

/**
 * Vue 外部样式文件模板（styled / complex 共用）
 */
export function createVueStyleTemplate(
  componentName: string,
  styleLang: string,
): string {
  const camel = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  return `.${camel} {
}
`;
}
