import { Language } from '../types';

/**
 * 创建简单组件模板
 */
export function createSimpleTemplate(
  componentName: string,
  language: Language,
): string {
  if (language === 'ts') {
    return `import React from 'react';

export default function ${componentName}() {
  return <div>${componentName}</div>;
}
`;
  }

  return `import React from 'react';

export default function ${componentName}() {
  return <div>${componentName}</div>;
}
`;
}