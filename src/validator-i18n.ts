/**
 * getComponentNameError 的英文版本，供 i18n 场景使用。
 */
export function getComponentNameErrorEn(componentName: string): string {
  if (!componentName) {
    return 'Component name cannot be empty';
  }
  if (!/^[A-Z]/.test(componentName)) {
    return 'Component name must start with an uppercase letter';
  }
  if (!/^[A-Z][A-Za-z0-9]*$/.test(componentName)) {
    return 'Component name can only contain letters and digits';
  }
  return '';
}
