import { Language } from '../types';

/**
 * 创建带样式组件的主文件模板
 */
export function createStyledTemplate(
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
 * 创建 less 样式文件模板
 */
export function createLessTemplate(componentName: string): string {
  const camelCaseName =
    componentName.charAt(0).toLowerCase() + componentName.slice(1);

  return `.${camelCaseName} {
}
`;
}