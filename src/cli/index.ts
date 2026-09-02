import { Command, CommanderError } from 'commander';
import path from 'path';
import { t, detectLang } from '../i18n/index';
import { printUsage } from './help';
import { parseOptions, getDefaultStyle, ParsedOptions } from './parser';
import { pickLanguage, pickFramework, pickStyle, pickType } from './prompts';
import { validateComponentName, getComponentNameError } from '../core/validator';
import { findExistingConflict } from '../core/conflict';
import { generateComponent } from '../core/creator';
import { renderTree } from '../utils/tree';
import { info, error, blank, logCreated } from '../utils/logger';
import { FRAMEWORK_LABELS, STYLE_LABELS, ComponentType } from '../types';

const BIN = 'scx';
const VERSION = '1.1.0';

/**
 * 主入口
 */
export async function run(): Promise<void> {
  const zh = detectLang() === 'zh';

  const program = new Command();

  program
    .name(BIN)
    .description(t('cli.description'))
    .version(VERSION)
    .argument('[target-directory]', t('usage.targetDir'))
    .argument('[component-name]', t('usage.componentName'))
    .option('--ts', t('option.ts'))
    .option('--js', t('option.js'))
    .option('--framework <framework>', t('option.framework'))
    .option('--style <style>', t('option.style'))
    .option('--type <type>', t('option.typeDesc'));

  let targetDirectory: string | undefined;
  let componentName: string | undefined;

  try {
    program.exitOverride();
    program.parse(process.argv);
    [targetDirectory, componentName] = [...program.args];
  } catch (err) {
    if (err instanceof CommanderError) {
      if (err.code === 'commander.helpDisplayed' || err.code === 'commander.version') {
        process.exit(0);
      }
      printUsage();
      process.exitCode = 1;
      return;
    }
    throw err;
  }

  // 参数缺失检查
  if (!targetDirectory) {
    if (componentName && componentName.startsWith('-') === false) {
      printUsage('target');
    } else {
      printUsage();
    }
    process.exitCode = 1;
    return;
  }
  if (!componentName) {
    printUsage('name');
    process.exitCode = 1;
    return;
  }

  const rawOptions = program.opts();
  const options: ParsedOptions = parseOptions([...program.args], rawOptions);

  // 组件名校验
  if (!validateComponentName(componentName)) {
    const msg = t('error.invalidComponentName');
    error(`❌ ${zh ? '错误' : 'Error'}: ${getComponentNameError(componentName, zh ? 'zh' : 'en')}`);
    blank();
    error(t('error.pascalCaseExample'));
    error(`  ${t('error.pascalCaseExamples')}`);
    process.exitCode = 1;
    return;
  }

  // 同名组件检查
  const conflict = findExistingConflict(targetDirectory, componentName);
  if (conflict) {
    error(t('error.componentExists', { name: componentName, path: conflict }));
    error(t('error.componentExistsHint'));
    process.exitCode = 1;
    return;
  }

  // 框架选择
  let framework = options.framework;
  if (!framework) {
    framework = await pickFramework();
  }

  // 语言选择
  let language = options.language;
  if (!language) {
    language = await pickLanguage();
  }

  // 样式选择
  let style = options.style;
  if (!style) {
    if (rawOptions.framework) {
      style = getDefaultStyle(framework);
    } else {
      style = await pickStyle(framework);
    }
  }

  // 类型选择
  let type = options.type;
  if (!type) {
    type = await pickType();
  }

  // 生成组件
  const result = generateComponent(
    {
      targetDirectory,
      componentName,
      framework,
      language,
      style,
      type,
    },
    detectLang(),
  );

  if (!result.success) {
    info(`\n❌ ${zh ? '错误' : 'Error'}: ${result.error}`);
    process.exitCode = 1;
    return;
  }

  // 输出结果
  logCreated(
    componentName,
    FRAMEWORK_LABELS[framework],
    language === 'ts' ? 'TypeScript' : 'JavaScript',
    STYLE_LABELS[style],
    t(`type.${type}`),
  );

  if (result.files && result.files.length > 0) {
    const baseAbs = path.resolve(targetDirectory);
    info(renderTree(result.files, baseAbs));
  }

  blank();
}