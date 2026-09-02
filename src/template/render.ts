import * as fs from 'fs';
import * as path from 'path';

/**
 * 模板变量
 */
export interface TemplateVars {
  componentName: string;    // 组件名（PascalCase）
  camelName: string;        // 小驼峰组件名
  style: string;            // 样式文件扩展名（less/scss/sass）
  scriptLang: string;       // 脚本语言（ts/js）
  styleLang: string;        // 样式语言（less/scss/sass）
  hookName?: string;        // hook/composable 名称
}

/**
 * 渲染模板（变量替换）
 * 支持 {{variable}} 语法的变量替换
 */
export function render(template: string, vars: TemplateVars): string {
  let result = template;

  // 替换所有 {{variable}} 格式的变量
  Object.entries(vars).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
  });

  return result;
}

/**
 * 加载模板文件
 */
export function loadTemplate(templatePath: string): string {
  const fullPath = path.join(__dirname, 'files', templatePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * 渲染指定模板文件
 */
export function renderTemplateFile(templatePath: string, vars: TemplateVars): string {
  const template = loadTemplate(templatePath);
  return render(template, vars);
}