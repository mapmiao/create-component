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
    return `import styles from './index.module.less';

export default function ${componentName}() {
  return <div className={styles.${camelCaseName}}>${componentName}</div>;
}
`;
  }

  return `import styles from './index.module.less';

export default function ${componentName}() {
  return <div className={styles.${camelCaseName}}>${componentName}</div>;
}
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