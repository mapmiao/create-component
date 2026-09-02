import { Framework, Language, Style, ComponentType, DEFAULT_STYLE_BY_FRAMEWORK } from '../types';

/**
 * 校验框架选项
 */
export function normalizeFrameworkFlag(flag?: string): Framework | undefined {
  const v = (flag || '').toLowerCase();
  if (v === 'react' || v === 'vue') return v as Framework;
  return undefined;
}

/**
 * 校验样式选项
 */
export function normalizeStyleFlag(flag?: string): Style | undefined {
  const v = (flag || '').toLowerCase();
  if (v === 'less' || v === 'scss' || v === 'sass') return v as Style;
  return undefined;
}

/**
 * 校验组件类型选项
 */
export function normalizeTypeFlag(flag?: string): ComponentType | undefined {
  const v = (flag || '').toLowerCase();
  if (v === 'simple' || v === 'styled' || v === 'complex') return v as ComponentType;
  return undefined;
}

/**
 * 解析命令行选项
 */
export interface ParsedOptions {
  targetDirectory?: string;
  componentName?: string;
  framework?: Framework;
  language?: Language;
  style?: Style;
  type?: ComponentType;
}

export function parseOptions(args: string[], rawOptions: Record<string, unknown>): ParsedOptions {
  const [targetDirectory, componentName] = args;

  const framework = normalizeFrameworkFlag(rawOptions.framework as string);
  const style = normalizeStyleFlag(rawOptions.style as string);
  const type = normalizeTypeFlag(rawOptions.type as string);

  let language: Language | undefined;
  if (rawOptions.ts) {
    language = 'ts';
  } else if (rawOptions.js) {
    language = 'js';
  }

  return {
    targetDirectory,
    componentName,
    framework,
    language,
    style,
    type,
  };
}

/**
 * 获取默认样式
 */
export function getDefaultStyle(framework: Framework): Style {
  return DEFAULT_STYLE_BY_FRAMEWORK[framework];
}