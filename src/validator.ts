/**
 * 验证组件名称是否符合大驼峰命名规范
 * 规则：以大写字母开头，后跟字母或数字
 */
export function validateComponentName(componentName: string): boolean {
  const pattern = /^[A-Z][A-Za-z0-9]*$/;
  return pattern.test(componentName);
}

/**
 * 获取组件名称校验错误信息
 */
export function getComponentNameError(componentName: string): string {
  if (!componentName) {
    return '组件名称不能为空';
  }

  if (!/^[A-Z]/.test(componentName)) {
    return '组件名称必须以大写字母开头';
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(componentName)) {
    return '组件名称只能包含字母和数字';
  }

  return '';
}