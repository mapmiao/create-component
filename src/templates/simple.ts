import { Language } from '../types';

/**
 * 创建简单组件模板
 */
export function createSimpleTemplate(
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