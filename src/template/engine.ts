import { Language, Style, styleExt } from '../types';
import { renderTemplateFile, TemplateVars } from './render';

/**
 * 将组件名转为小驼峰
 */
function camel(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * 获取样式模块文件名
 */
function moduleFile(style: Style): string {
  return style === 'less' ? 'index.module.less' : `index.module.${style}`;
}

/**
 * 构建模板变量
 */
function buildVars(componentName: string, language: Language, style: Style): TemplateVars {
  return {
    componentName,
    camelName: camel(componentName),
    style: style === 'less' ? 'less' : style,
    scriptLang: language === 'ts' ? 'ts' : 'js',
    styleLang: styleExt(style),
    hookName: `use${componentName}`,
  };
}

// ==================== React 模板 ====================

export function createReactSimpleTemplate(componentName: string, language: Language): string {
  const ext = language === 'ts' ? 'tsx' : 'jsx';
  const vars = buildVars(componentName, language, 'less');
  return renderTemplateFile(`react/simple/Component.${ext}.tpl`, vars);
}

export function createReactStyledTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const ext = language === 'ts' ? 'tsx' : 'jsx';
  const vars = buildVars(componentName, language, style);
  return renderTemplateFile(`react/styled/Component.${ext}.tpl`, vars);
}

export function createReactStyleTemplate(componentName: string, style: Style): string {
  const vars: TemplateVars = {
    componentName,
    camelName: camel(componentName),
    style: style === 'less' ? 'less' : style,
    scriptLang: 'ts',
    styleLang: styleExt(style),
  };
  return renderTemplateFile('react/styled/style.css.tpl', vars);
}

export function createReactComplexIndexTemplate(componentName: string, language: Language): string {
  const vars = buildVars(componentName, language, 'less');
  return renderTemplateFile('react/complex/index.ts.tpl', vars);
}

export function createReactComplexComponentTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const ext = language === 'ts' ? 'tsx' : 'jsx';
  const vars = buildVars(componentName, language, style);
  return renderTemplateFile(`react/complex/Component.${ext}.tpl`, vars);
}

export function createReactComplexHookTemplate(componentName: string, language: Language): string {
  const ext = language === 'ts' ? 'ts' : 'js';
  const vars = buildVars(componentName, language, 'less');
  return renderTemplateFile(`react/complex/hook.${ext}.tpl`, vars);
}

export function createReactComplexUtilsTemplate(): string {
  return renderTemplateFile('react/complex/utils.ts.tpl', {} as TemplateVars);
}

// ==================== Vue 模板 ====================

export function createVueSimpleTemplate(
  componentName: string,
  language: Language,
  styleLang: string,
): string {
  const langSuffix = language === 'ts' ? 'ts' : 'js';
  const vars: TemplateVars = {
    componentName,
    camelName: camel(componentName),
    style: 'less',
    scriptLang: language === 'ts' ? 'ts' : 'js',
    styleLang,
  };
  return renderTemplateFile(`vue/simple/Component.vue.${langSuffix}.tpl`, vars);
}

export function createVueStyledTemplate(
  componentName: string,
  language: Language,
  styleLang: string,
): string {
  const langSuffix = language === 'ts' ? 'ts' : 'js';
  const vars: TemplateVars = {
    componentName,
    camelName: camel(componentName),
    style: 'less',
    scriptLang: language === 'ts' ? 'ts' : 'js',
    styleLang,
  };
  return renderTemplateFile(`vue/styled/Component.vue.${langSuffix}.tpl`, vars);
}

export function createVueStyleTemplate(componentName: string, styleLang: string): string {
  const vars: TemplateVars = {
    componentName,
    camelName: camel(componentName),
    style: 'less',
    scriptLang: 'ts',
    styleLang,
  };
  return renderTemplateFile('vue/styled/style.css.tpl', vars);
}

export function createVueComplexComponentTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const langSuffix = language === 'ts' ? 'ts' : 'js';
  const vars = buildVars(componentName, language, style);
  return renderTemplateFile(`vue/complex/Component.vue.${langSuffix}.tpl`, vars);
}

export function createVueComplexIndexTemplate(componentName: string): string {
  const vars: TemplateVars = {
    componentName,
    camelName: camel(componentName),
    style: 'less',
    scriptLang: 'ts',
    styleLang: 'scss',
  };
  return renderTemplateFile('vue/complex/index.ts.tpl', vars);
}

export function createVueComposableTemplate(componentName: string, language: Language): string {
  const ext = language === 'ts' ? 'ts' : 'js';
  const vars = buildVars(componentName, language, 'scss');
  return renderTemplateFile(`vue/complex/composable.${ext}.tpl`, vars);
}

export function createVueUtilsTemplate(): string {
  return renderTemplateFile('vue/complex/utils.ts.tpl', {} as TemplateVars);
}