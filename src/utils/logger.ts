import { t } from '../i18n/index';

/**
 * 输出错误信息
 */
export function error(message: string): void {
  console.error(message);
}

/**
 * 输出普通信息
 */
export function info(message: string): void {
  console.log(message);
}

/**
 * 输出空行
 */
export function blank(): void {
  console.log('');
}

/**
 * 输出成功信息
 */
export function success(message: string): void {
  console.log(message);
}

/**
 * 输出创建结果
 */
export function logCreated(componentName: string, framework: string, language: string, style: string, type: string): void {
  const lang = t('cli.created');
  info(`\n${lang}\n`);
  info(`${t('cli.componentName')}: ${componentName}`);
  info(`${t('cli.framework')}: ${framework}`);
  info(`${t('cli.language')}: ${language}`);
  info(`${t('cli.style')}: ${style}`);
  info(`${t('cli.type')}: ${type}`);
  blank();
  info(t('cli.createdFiles'));
}