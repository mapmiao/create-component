import * as path from 'path';
import { CreateComponentOptions, styleExt } from '../types';
import { resolvePath, joinPath, ensureDir, writeFile } from '../utils/file';
import { checkComponentExists } from './conflict';
import {
  createReactSimpleTemplate,
  createReactStyledTemplate,
  createReactStyleTemplate,
  createReactComplexIndexTemplate,
  createReactComplexComponentTemplate,
  createReactComplexHookTemplate,
  createReactComplexUtilsTemplate,
  createVueSimpleTemplate,
  createVueStyledTemplate,
  createVueStyleTemplate,
  createVueComplexComponentTemplate,
  createVueComplexIndexTemplate,
  createVueComposableTemplate,
  createVueUtilsTemplate,
} from '../template/engine';
import { t } from '../i18n/index';

/**
 * 生成结果
 */
export interface GenerateResult {
  success: boolean;
  files?: string[];
  error?: string;
}

// ==================== React 生成 ====================

function generateReactSimple(options: CreateComponentOptions): string[] {
  const ext = options.language === 'ts' ? 'tsx' : 'jsx';
  const basePath = resolvePath(options.targetDirectory);
  const filePath = joinPath(basePath, `${options.componentName}.${ext}`);
  const content = createReactSimpleTemplate(options.componentName, options.language);
  writeFile(filePath, content);
  return [filePath];
}

function generateReactStyled(options: CreateComponentOptions): string[] {
  const basePath = resolvePath(options.targetDirectory);
  const componentDir = joinPath(basePath, options.componentName);
  const ext = options.language === 'ts' ? 'tsx' : 'jsx';
  ensureDir(componentDir);

  const files: string[] = [];

  const indexFile = joinPath(componentDir, `index.${ext}`);
  writeFile(indexFile, createReactStyledTemplate(options.componentName, options.language, options.style));
  files.push(indexFile);

  const styleName = `index.module.${options.style === 'less' ? 'less' : options.style}`;
  const styleFile = joinPath(componentDir, styleName);
  writeFile(styleFile, createReactStyleTemplate(options.componentName, options.style));
  files.push(styleFile);

  return files;
}

function generateReactComplex(options: CreateComponentOptions): string[] {
  const basePath = resolvePath(options.targetDirectory);
  const componentDir = joinPath(basePath, options.componentName);
  const langExt = options.language === 'ts' ? 'tsx' : 'jsx';
  const plainExt = options.language === 'ts' ? 'ts' : 'js';
  ensureDir(componentDir);

  const files: string[] = [];

  const indexFile = joinPath(componentDir, `index.${plainExt}`);
  writeFile(indexFile, createReactComplexIndexTemplate(options.componentName, options.language));
  files.push(indexFile);

  const componentFile = joinPath(componentDir, `${options.componentName}.${langExt}`);
  writeFile(componentFile, createReactComplexComponentTemplate(options.componentName, options.language, options.style));
  files.push(componentFile);

  const styleName = `index.module.${options.style === 'less' ? 'less' : options.style}`;
  const styleFile = joinPath(componentDir, styleName);
  writeFile(styleFile, createReactStyleTemplate(options.componentName, options.style));
  files.push(styleFile);

  const hookDir = joinPath(componentDir, 'hook');
  ensureDir(hookDir);
  const hookFile = joinPath(hookDir, `use${options.componentName}.${plainExt}`);
  writeFile(hookFile, createReactComplexHookTemplate(options.componentName, options.language));
  files.push(hookFile);

  const utilsDir = joinPath(componentDir, 'utils');
  ensureDir(utilsDir);
  const utilsFile = joinPath(utilsDir, `index.${plainExt}`);
  writeFile(utilsFile, createReactComplexUtilsTemplate());
  files.push(utilsFile);

  return files;
}

// ==================== Vue 生成 ====================

function generateVueSimple(options: CreateComponentOptions): string[] {
  const basePath = resolvePath(options.targetDirectory);
  const filePath = joinPath(basePath, `${options.componentName}.vue`);
  const styleLang = styleExt(options.style);
  writeFile(filePath, createVueSimpleTemplate(options.componentName, options.language, styleLang));
  return [filePath];
}

function generateVueStyled(options: CreateComponentOptions): string[] {
  const basePath = resolvePath(options.targetDirectory);
  const componentDir = joinPath(basePath, options.componentName);
  ensureDir(componentDir);
  const styleLang = styleExt(options.style);

  const files: string[] = [];

  const vueFile = joinPath(componentDir, 'index.vue');
  writeFile(vueFile, createVueStyledTemplate(options.componentName, options.language, styleLang));
  files.push(vueFile);

  const styleFile = joinPath(componentDir, `index.${styleLang}`);
  writeFile(styleFile, createVueStyleTemplate(options.componentName, styleLang));
  files.push(styleFile);

  return files;
}

function generateVueComplex(options: CreateComponentOptions): string[] {
  const basePath = resolvePath(options.targetDirectory);
  const componentDir = joinPath(basePath, options.componentName);
  const plainExt = options.language === 'ts' ? 'ts' : 'js';
  const styleLang = styleExt(options.style);
  ensureDir(componentDir);

  const files: string[] = [];

  // 主 SFC
  const vueFile = joinPath(componentDir, `${options.componentName}.vue`);
  writeFile(vueFile, createVueComplexComponentTemplate(options.componentName, options.language, options.style));
  files.push(vueFile);

  // 入口
  const indexFile = joinPath(componentDir, `index.${plainExt}`);
  writeFile(indexFile, createVueComplexIndexTemplate(options.componentName));
  files.push(indexFile);

  // 样式
  const styleFile = joinPath(componentDir, `index.${styleLang}`);
  writeFile(styleFile, createVueStyleTemplate(options.componentName, styleLang));
  files.push(styleFile);

  // composable
  const compDir = joinPath(componentDir, 'composable');
  ensureDir(compDir);
  const compFile = joinPath(compDir, `use${options.componentName}.${plainExt}`);
  writeFile(compFile, createVueComposableTemplate(options.componentName, options.language));
  files.push(compFile);

  // utils
  const utilsDir = joinPath(componentDir, 'utils');
  ensureDir(utilsDir);
  const utilsFile = joinPath(utilsDir, `index.${plainExt}`);
  writeFile(utilsFile, createVueUtilsTemplate());
  files.push(utilsFile);

  return files;
}

// ==================== 主入口 ====================

export function generateComponent(
  options: CreateComponentOptions,
  locale: 'zh' | 'en' = 'zh',
): GenerateResult {
  try {
    const basePath = resolvePath(options.targetDirectory);
    ensureDir(basePath);

    if (checkComponentExists(
      options.targetDirectory,
      options.componentName,
      options.framework,
      options.type,
      options.language,
    )) {
      const msg = t('error.componentExists', {
        name: options.componentName,
        path: options.targetDirectory,
      });
      return { success: false, error: msg };
    }

    let files: string[];
    switch (options.framework) {
      case 'react':
        switch (options.type) {
          case 'simple':
            files = generateReactSimple(options);
            break;
          case 'styled':
            files = generateReactStyled(options);
            break;
          case 'complex':
            files = generateReactComplex(options);
            break;
          default:
            return {
              success: false,
              error: locale === 'zh'
                ? `未知的组件类型: ${options.type}`
                : `Unknown component type: ${options.type}`,
            };
        }
        break;
      case 'vue':
        switch (options.type) {
          case 'simple':
            files = generateVueSimple(options);
            break;
          case 'styled':
            files = generateVueStyled(options);
            break;
          case 'complex':
            files = generateVueComplex(options);
            break;
          default:
            return {
              success: false,
              error: locale === 'zh'
                ? `未知的组件类型: ${options.type}`
                : `Unknown component type: ${options.type}`,
            };
        }
        break;
      default:
        return {
          success: false,
          error: locale === 'zh'
            ? `未知的框架: ${options.framework}`
            : `Unknown framework: ${options.framework}`,
        };
    }

    return { success: true, files };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}