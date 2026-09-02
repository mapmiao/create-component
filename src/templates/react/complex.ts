import { Language, Style } from '../../types';
import { createReactStyleTemplate } from './simple_styled';

function moduleFile(style: Style): string {
  return style === 'less' ? 'index.module.less' : `index.module.${style}`;
}

function camel(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * React 复杂组件 index 入口
 */
export function createReactComplexIndexTemplate(
  componentName: string,
  language: Language,
): string {
  return `export { default } from './${componentName}';
`;
}

/**
 * React 复杂组件主组件文件
 */
export function createReactComplexComponentTemplate(
  componentName: string,
  language: Language,
  style: Style,
): string {
  const styleFile = moduleFile(style);
  const camelName = camel(componentName);
  const hookName = `use${componentName}`;
  const hookImport = `import { ${hookName} } from './hook/${hookName}';
`;
  const prelude = `import * as React from "react";
import styles from "./${styleFile}";
`;
  const hookUsage = `${hookName}()`;

  if (language === 'ts') {
    return `${prelude}${hookImport}
interface I${componentName}Props {}

const ${componentName}: React.FC<I${componentName}Props> = () => {
  const { count, handleClick } = ${hookUsage};

  return (
    <div className={styles.${camelName}} onClick={handleClick}>
      <span>${componentName} ({count})</span>
    </div>
  );
};
export default ${componentName};
`;
  }

  return `${prelude}${hookImport}
const ${componentName}: React.FC = () => {
  const { count, handleClick } = ${hookUsage};

  return (
    <div className={styles.${camelName}} onClick={handleClick}>
      <span>${componentName} ({count})</span>
    </div>
  );
};
export default ${componentName};
`;
}

/**
 * React 复杂组件 hook 文件
 */
export function createReactComplexHookTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `import { useState } from 'react';

interface Use${componentName}Return {
  count: number;
  handleClick: () => void;
}

export function use${componentName}(): Use${componentName}Return {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return { count, handleClick };
}
`;
  }

  return `import { useState } from 'react';

export function use${componentName}() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return { count, handleClick };
}
`;
}

/**
 * React 复杂组件 utils 文件
 */
export function createReactComplexUtilsTemplate(
  componentName: string,
  language: Language,
): string {
  return `export {};
`;
}

export { createReactStyleTemplate };
