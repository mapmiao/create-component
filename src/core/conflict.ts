import * as fs from 'fs';
import * as path from 'path';
import { resolvePath, joinPath, exists } from '../utils/file';

/**
 * 通用冲突检查：不依赖框架/类型/语言，只要目标目录下可能存在同名产物即视为冲突。
 */
export function findExistingConflict(
  targetDirectory: string,
  componentName: string,
): string | null {
  const basePath = resolvePath(targetDirectory);

  // 目录形态（styled/complex 会创建同名目录）
  const dirPath = joinPath(basePath, componentName);
  if (exists(dirPath)) return dirPath;

  // 单文件形态（simple）：vue / react(tsx,jsx)
  for (const ext of ['vue', 'tsx', 'jsx']) {
    const f = joinPath(basePath, `${componentName}.${ext}`);
    if (exists(f)) return f;
  }

  return null;
}

/**
 * 生成阶段的兜底精确检查：组件是否已存在于目标位置。
 */
export function checkComponentExists(
  targetDirectory: string,
  componentName: string,
  framework: 'react' | 'vue',
  type: 'simple' | 'styled' | 'complex',
  language: 'ts' | 'js',
): boolean {
  const basePath = resolvePath(targetDirectory);

  // simple：单个文件
  if (type === 'simple') {
    if (framework === 'vue') {
      const filePath = joinPath(basePath, `${componentName}.vue`);
      return exists(filePath);
    }
    const extension = language === 'ts' ? 'tsx' : 'jsx';
    const filePath = joinPath(basePath, `${componentName}.${extension}`);
    return exists(filePath);
  }

  // styled 和 complex 都是创建目录
  const componentDir = joinPath(basePath, componentName);
  return exists(componentDir);
}