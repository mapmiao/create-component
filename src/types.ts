export type Language = 'ts' | 'js';

export type Framework = 'react' | 'vue';

export type ComponentType = 'simple' | 'styled' | 'complex';

/** 样式预处理语言 */
export type Style = 'less' | 'scss' | 'sass';

/** 样式后缀归一化（sass 与 scss 同属 sass，生成走 style 原值即可，这里提供扩展名辅助） */
export function styleExt(style: Style): string {
  return style === 'less' ? 'less' : style; // 'scss' | 'sass'
}

export interface CreateComponentOptions {
  targetDirectory: string;
  componentName: string;
  language: Language;
  framework: Framework;
  style: Style;
  type: ComponentType;
}

/** 框架默认样式：react→less，vue→scss */
export const DEFAULT_STYLE_BY_FRAMEWORK: Record<Framework, Style> = {
  react: 'less',
  vue: 'scss',
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: 'React',
  vue: 'Vue',
};

export const STYLE_LABELS: Record<Style, string> = {
  less: 'Less',
  scss: 'SCSS',
  sass: 'Sass',
};
