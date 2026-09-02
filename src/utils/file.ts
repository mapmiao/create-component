import * as fs from 'fs';
import * as path from 'path';

/**
 * 确保目录存在
 */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 写入文件（自动创建父目录）
 */
export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 检查文件/目录是否存在
 */
export function exists(path: string): boolean {
  return fs.existsSync(path);
}

/**
 * 获取绝对路径
 */
export function resolvePath(...paths: string[]): string {
  return path.resolve(...paths);
}

/**
 * 连接路径
 */
export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}