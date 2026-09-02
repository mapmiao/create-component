import { Language } from '../../types';

/**
 * Vue 复杂组件 utils 文件
 */
export function createVueUtilsTemplate(language: Language): string {
  return language === 'ts'
    ? `/**
 * 该组件的通用工具函数
 */

export {}
`
    : `/**
 * 该组件的通用工具函数
 */

export {}
`;
}
