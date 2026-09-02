import * as fs from 'fs';
import * as path from 'path';
import {
  CreateComponentOptions,
  styleExt,
} from './types';
// React templates
import {
  createReactSimpleTemplate,
  createReactStyledTemplate,
  createReactStyleTemplate,
} from './templates/react/simple_styled';
import {
  createReactComplexIndexTemplate,
  createReactComplexComponentTemplate,
  createReactComplexHookTemplate,
  createReactComplexUtilsTemplate,
} from './templates/react/complex';
// Vue templates
import { createVueSimpleTemplate } from './templates/vue/simple';
import {
  createVueStyledTemplate,
  createVueStyleTemplate,
} from './templates/vue/styled';
import {
  createVueComplexComponentTemplate,
  createVueComplexIndexTemplate,
  createVueComposableTemplate,
} from './templates/vue/complex';
import { createVueUtilsTemplate } from './templates/vue/utils';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

function checkComponentExists(options: CreateComponentOptions): boolean {
  const basePath = path.resolve(options.targetDirectory);

  // simple：单个文件
  if (options.type === 'simple') {
    if (options.framework === 'vue') {
      const filePath = path.join(basePath, `${options.componentName}.vue`);
      return fs.existsSync(filePath);
    }
    const extension = options.language === 'ts' ? 'tsx' : 'js';
    const filePath = path.join(basePath, `${options.componentName}.${extension}`);
    return fs.existsSync(filePath);
  }

  // styled 和 complex 都是创建目录
  const componentDir = path.join(basePath, options.componentName);
  return fs.existsSync(componentDir);
}

/* ---------------------- React 生成 ---------------------- */

function generateReactSimple(options: CreateComponentOptions): string[] {
  const ext = options.language === 'ts' ? 'tsx' : 'js';
  const basePath = path.resolve(options.targetDirectory);
  const filePath = path.join(basePath, `${options.componentName}.${ext}`);
  const content = createReactSimpleTemplate(options.componentName, options.language);
  writeFile(filePath, content);
  return [filePath];
}

function generateReactStyled(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  const ext = options.language === 'ts' ? 'tsx' : 'js';
  ensureDir(componentDir);

  const files: string[] = [];

  const indexFile = path.join(componentDir, `index.${ext}`);
  writeFile(indexFile, createReactStyledTemplate(options.componentName, options.language, options.style));
  files.push(indexFile);

  const styleName = `index.module.${options.style === 'less' ? 'less' : options.style}`;
  const styleFile = path.join(componentDir, styleName);
  writeFile(styleFile, createReactStyleTemplate(options.componentName, options.style));
  files.push(styleFile);

  return files;
}

function generateReactComplex(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  const langExt = options.language === 'ts' ? 'tsx' : 'js';
  const plainExt = options.language === 'ts' ? 'ts' : 'js';
  ensureDir(componentDir);

  const files: string[] = [];

  const indexFile = path.join(componentDir, `index.${plainExt}`);
  writeFile(indexFile, createReactComplexIndexTemplate(options.componentName, options.language));
  files.push(indexFile);

  const componentFile = path.join(componentDir, `${options.componentName}.${langExt}`);
  writeFile(componentFile, createReactComplexComponentTemplate(options.componentName, options.language, options.style));
  files.push(componentFile);

  const styleName = `index.module.${options.style === 'less' ? 'less' : options.style}`;
  const styleFile = path.join(componentDir, styleName);
  writeFile(styleFile, createReactStyleTemplate(options.componentName, options.style));
  files.push(styleFile);

  const hookDir = path.join(componentDir, 'hook');
  ensureDir(hookDir);
  const hookFile = path.join(hookDir, `use${options.componentName}.${plainExt}`);
  writeFile(hookFile, createReactComplexHookTemplate(options.componentName, options.language));
  files.push(hookFile);

  const utilsDir = path.join(componentDir, 'utils');
  ensureDir(utilsDir);
  const utilsFile = path.join(utilsDir, `index.${plainExt}`);
  writeFile(utilsFile, createReactComplexUtilsTemplate(options.componentName, options.language));
  files.push(utilsFile);

  return files;
}

/* ---------------------- Vue 生成 ---------------------- */

function generateVueSimple(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const filePath = path.join(basePath, `${options.componentName}.vue`);
  const styleLang = styleExt(options.style);
  writeFile(filePath, createVueSimpleTemplate(options.componentName, options.language, styleLang));
  return [filePath];
}

function generateVueStyled(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  ensureDir(componentDir);
  const styleLang = styleExt(options.style);

  const files: string[] = [];

  const vueFile = path.join(componentDir, 'index.vue');
  writeFile(vueFile, createVueStyledTemplate(options.componentName, options.language, styleLang));
  files.push(vueFile);

  const styleFile = path.join(componentDir, `index.${styleLang}`);
  writeFile(styleFile, createVueStyleTemplate(options.componentName, styleLang));
  files.push(styleFile);

  return files;
}

function generateVueComplex(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  const plainExt = options.language === 'ts' ? 'ts' : 'js';
  const styleLang = styleExt(options.style);
  ensureDir(componentDir);

  const files: string[] = [];

  // 主 SFC（{Name}.vue）
  const vueFile = path.join(componentDir, `${options.componentName}.vue`);
  writeFile(vueFile, createVueComplexComponentTemplate(options.componentName, options.language, options.style));
  files.push(vueFile);

  // 入口（index.ts/index.js）
  const indexFile = path.join(componentDir, `index.${plainExt}`);
  writeFile(indexFile, createVueComplexIndexTemplate(options.componentName));
  files.push(indexFile);

  // 样式（index.scss / index.less）
  const styleFile = path.join(componentDir, `index.${styleLang}`);
  writeFile(styleFile, createVueStyleTemplate(options.componentName, styleLang));
  files.push(styleFile);

  // composable（vue 惯例，对应 react 的 hook）
  const compDir = path.join(componentDir, 'composable');
  ensureDir(compDir);
  const compFile = path.join(compDir, `use${options.componentName}.${plainExt}`);
  writeFile(compFile, createVueComposableTemplate(options.componentName, options.language));
  files.push(compFile);

  // utils
  const utilsDir = path.join(componentDir, 'utils');
  ensureDir(utilsDir);
  const utilsFile = path.join(utilsDir, `index.${plainExt}`);
  writeFile(utilsFile, createVueUtilsTemplate(options.language));
  files.push(utilsFile);

  return files;
}

/* ---------------------- 主入口 ---------------------- */

export function generateComponent(
  options: CreateComponentOptions,
): { success: boolean; files?: string[]; error?: string } {
  try {
    const basePath = path.resolve(options.targetDirectory);
    ensureDir(basePath);

    if (checkComponentExists(options)) {
      return {
        success: false,
        error: `组件 "${options.componentName}" 已存在`,
      };
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
            return { success: false, error: `未知的组件类型: ${options.type}` };
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
            return { success: false, error: `未知的组件类型: ${options.type}` };
        }
        break;
      default:
        return { success: false, error: `未知的框架: ${options.framework}` };
    }

    return { success: true, files };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
