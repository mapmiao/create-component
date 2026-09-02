import { Language, Style } from '../../types';

function moduleFile(style: Style): string {
  return style === 'less' ? 'index.module.less' : `index.module.${style}`;
}

/**
 * React 简单组件模板
 */
export function createReactSimpleTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `import * as React from "react";

interface I${componentName}Props {}

const ${componentName}: React.FC<I${componentName}Props> = () => {
  return <div>${componentName}</div>;
};
export default ${componentName};
`;
  }

  return `import * as React from "react";

const ${componentName}: React.FC = () => {
  return <div>${componentName}</div>;
};
export default ${componentName};
`;
}

/**
 * React 带样式组件主文件模板（CSS Module）
 */
export function createReactStyledTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const styleFile = moduleFile(style);
  const camel = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const prelude = `import * as React from "react";
import styles from "./${styleFile}";
`;

  if (language === 'ts') {
    return `${prelude}
interface I${componentName}Props {}

const ${componentName}: React.FC<I${componentName}Props> = () => {
  return <div className={styles.${camel}}>${componentName}</div>;
};
export default ${componentName};
`;
  }

  return `const ${componentName}: React.FC = () => {
  return <div className={styles.${camel}}>${componentName}</div>;
};
export default ${componentName};
`;
}

/**
 * React CSS Module 样式文件模板
 */
export function createReactStyleTemplate(
  componentName: string,
  style: Style,
): string {
  const camel = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  return `.${camel} {
}
`;
}
