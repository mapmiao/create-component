import { Language } from '../types';

/**
 * 创建复杂组件的 index 入口文件
 */
export function createComplexIndexTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `export { default } from './${componentName}';
`;
  }

  return `export { default } from './${componentName}';
`;
}

/**
 * 创建复杂组件的主组件文件
 */
export function createComplexComponentTemplate(
  componentName: string,
  language: Language,
): string {
  const camelCaseName =
    componentName.charAt(0).toLowerCase() + componentName.slice(1);

  if (language === 'ts') {
    return `import * as React from "react";
import styles from "./index.module.less";

interface I${componentName}Props {}

const ${componentName}: React.FC<I${componentName}Props> = () => {
  return <div className={styles.${camelCaseName}}>${componentName}</div>;
};
export default ${componentName};
`;
  }

  return `import * as React from "react";
import styles from "./index.module.less";

const ${componentName}: React.FC = () => {
  return <div className={styles.${camelCaseName}}>${componentName}</div>;
};
export default ${componentName};
`;
}

/**
 * 创建复杂组件的 Hook 文件
 */
export function createComplexHookTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `export function use${componentName}() {
}
`;
  }

  return `export function use${componentName}() {
}
`;
}

/**
 * 创建复杂组件的 utils 文件
 */
export function createComplexUtilsTemplate(language: Language): string {
  return `export {};
`;
}