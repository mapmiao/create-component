import { Language, Style } from '../../types';
import { styleExt } from '../../types';
import { createVueStyleTemplate } from './styled';

/**
 * Vue 复杂组件：主 SFC 模板
 * 组件 + 独立外部样式 + composable + utils
 */
export function createVueComplexComponentTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const styleLang = styleExt(style);
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
import { use${componentName} } from './composable/use${componentName}'
${propsBlock}
const { count, handleClick } = use${componentName}(props)
</script>

<template>
  <div class="${camel}" @click="handleClick">
    <span>${componentName} ({{ count }})</span>
  </div>
</template>

<style lang="${styleLang}" scoped>
@import "./index.${styleLang}";
</style>
`;
}

/**
 * Vue 复杂组件入口（转发到 SFC）
 */
export function createVueComplexIndexTemplate(
  componentName: string,
): string {
  return `export { default } from './${componentName}.vue'
`;
}

/**
 * Vue 复杂组件 composable 文件
 */
export function createVueComposableTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `import { ref, type Ref } from 'vue'

export interface Use${componentName}Result {
  count: Ref<number>
  handleClick: () => void
}

export function use${componentName}(props: Record<string, unknown>): Use${componentName}Result {
  const count = ref(0)

  const handleClick = () => {
    count.value += 1
  }

  return {
    count,
    handleClick,
  }
}
`;
  }

  return `import { ref } from 'vue'

export function use${componentName}(props) {
  const count = ref(0)

  const handleClick = () => {
    count.value += 1
  }

  return {
    count,
    handleClick,
  }
}
`;
}

export { createVueStyleTemplate };
