import * as fs from 'fs';
import * as path from 'path';
import { CreateComponentOptions, Language } from './types';
import { createSimpleTemplate } from './templates/simple';
import {
  createStyledTemplate,
  createLessTemplate,
} from './templates/styled';
import {
  createComplexIndexTemplate,
  createComplexComponentTemplate,
  createComplexHookTemplate,
  createComplexUtilsTemplate,
} from './templates/complex';

/**
 * 确保目录存在，不存在则递归创建
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 写入文件
 */
function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 检查组件是否已存在
 */
function checkComponentExists(options: CreateComponentOptions): boolean {
  const basePath = path.resolve(options.targetDirectory);

  if (options.type === 'simple') {
    const extension = options.language === 'ts' ? 'tsx' : 'js';
    const filePath = path.join(
      basePath,
      `${options.componentName}.${extension}`,
    );
    return fs.existsSync(filePath);
  }

  // styled 和 complex 都是创建目录
  const componentDir = path.join(basePath, options.componentName);
  return fs.existsSync(componentDir);
}

/**
 * 生成简单组件
 */
function generateSimple(options: CreateComponentOptions): string[] {
  const extension = options.language === 'ts' ? 'tsx' : 'js';
  const basePath = path.resolve(options.targetDirectory);
  const filePath = path.join(basePath, `${options.componentName}.${extension}`);

  const content = createSimpleTemplate(options.componentName, options.language);
  writeFile(filePath, content);

  return [filePath];
}

/**
 * 生成带样式组件
 */
function generateStyled(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  const extension = options.language === 'ts' ? 'tsx' : 'js';

  ensureDir(componentDir);

  const files: string[] = [];

  // 生成主文件
  const indexFile = path.join(componentDir, `index.${extension}`);
  const indexContent = createStyledTemplate(
    options.componentName,
    options.language,
  );
  writeFile(indexFile, indexContent);
  files.push(indexFile);

  // 生成样式文件
  const lessFile = path.join(componentDir, 'index.module.less');
  const lessContent = createLessTemplate(options.componentName);
  writeFile(lessFile, lessContent);
  files.push(lessFile);

  return files;
}

/**
 * 生成复杂组件
 */
function generateComplex(options: CreateComponentOptions): string[] {
  const basePath = path.resolve(options.targetDirectory);
  const componentDir = path.join(basePath, options.componentName);
  const extension = options.language === 'ts' ? 'tsx' : 'js';

  ensureDir(componentDir);

  const files: string[] = [];

  // 生成 index 入口文件
  const indexFile = path.join(componentDir, `index.${extension === 'tsx' ? 'ts' : 'js'}`);
  const indexContent = createComplexIndexTemplate(
    options.componentName,
    options.language,
  );
  writeFile(indexFile, indexContent);
  files.push(indexFile);

  // 生成主组件文件
  const componentFile = path.join(componentDir, `${options.componentName}.${extension}`);
  const componentContent = createComplexComponentTemplate(
    options.componentName,
    options.language,
  );
  writeFile(componentFile, componentContent);
  files.push(componentFile);

  // 生成样式文件
  const lessFile = path.join(componentDir, 'index.module.less');
  const lessContent = createLessTemplate(options.componentName);
  writeFile(lessFile, lessContent);
  files.push(lessFile);

  // 生成 hook 目录和文件
  const hookDir = path.join(componentDir, 'hook');
  ensureDir(hookDir);
  const hookFile = path.join(
    hookDir,
    `use${options.componentName}.${extension === 'tsx' ? 'ts' : 'js'}`,
  );
  const hookContent = createComplexHookTemplate(
    options.componentName,
    options.language,
  );
  writeFile(hookFile, hookContent);
  files.push(hookFile);

  // 生成 utils 目录和文件
  const utilsDir = path.join(componentDir, 'utils');
  ensureDir(utilsDir);
  const utilsFile = path.join(
    utilsDir,
    `index.${extension === 'tsx' ? 'ts' : 'js'}`,
  );
  const utilsContent = createComplexUtilsTemplate(options.language);
  writeFile(utilsFile, utilsContent);
  files.push(utilsFile);

  return files;
}

/**
 * 生成组件主函数
 */
export function generateComponent(
  options: CreateComponentOptions,
): { success: boolean; files?: string[]; error?: string } {
  try {
    // 确保目标目录存在
    const basePath = path.resolve(options.targetDirectory);
    ensureDir(basePath);

    // 检查组件是否已存在
    if (checkComponentExists(options)) {
      return {
        success: false,
        error: `组件 "${options.componentName}" 已存在`,
      };
    }

    // 根据类型生成组件
    let files: string[];
    switch (options.type) {
      case 'simple':
        files = generateSimple(options);
        break;
      case 'styled':
        files = generateStyled(options);
        break;
      case 'complex':
        files = generateComplex(options);
        break;
      default:
        return {
          success: false,
          error: `未知的组件类型: ${options.type}`,
        };
    }

    return { success: true, files };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}