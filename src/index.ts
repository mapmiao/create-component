import { Command } from 'commander';
import inquirer from 'inquirer';
import { validateComponentName, getComponentNameError } from './validator';
import { generateComponent } from './generator';
import {
  ComponentType,
  Framework,
  Language,
  Style,
  DEFAULT_STYLE_BY_FRAMEWORK,
  FRAMEWORK_LABELS,
  STYLE_LABELS,
} from './types';

const BIN = 'cc';
const VERSION = '1.0.0';

const program = new Command();

const TYPE_NAMES: Record<ComponentType, string> = {
  simple: '简单组件',
  styled: '带样式组件',
  complex: '复杂组件',
};

const FRAMEWORK_NAMES: Record<Framework, string> = {
  react: 'React',
  vue: 'Vue 3',
};

/* ---------------------- 交互式提示 ---------------------- */

async function pickLanguage(flag?: string): Promise<Language> {
  if (flag === 'ts') return 'ts';
  if (flag === 'js') return 'js';
  const answer = await inquirer.prompt<{ language: Language }>([
    {
      type: 'list',
      name: 'language',
      message: '选择语言',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' },
      ],
    },
  ]);
  return answer.language;
}

async function pickFramework(flag?: string): Promise<Framework> {
  const value = (flag || '').toLowerCase();
  if (value === 'react' || value === 'vue') return value as Framework;
  const answer = await inquirer.prompt<{ framework: Framework }>([
    {
      type: 'list',
      name: 'framework',
      message: '选择框架',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue 3', value: 'vue' },
      ],
    },
  ]);
  return answer.framework;
}

/** 校验 framework 选项：react | vue（不合法返回 undefined） */
function normalizeFrameworkFlag(flag?: string): Framework | undefined {
  const v = (flag || '').toLowerCase();
  if (v === 'react' || v === 'vue') return v as Framework;
  return undefined;
}

/** 校验 style 选项：可选 less | scss | sass */
function normalizeStyleFlag(flag?: string): Style | undefined {
  const v = (flag || '').toLowerCase();
  if (v === 'less' || v === 'scss' || v === 'sass') return v as Style;
  return undefined;
}

async function pickStyle(flag?: string, framework?: Framework): Promise<Style> {
  const normalized = normalizeStyleFlag(flag);
  if (normalized) return normalized;

  const defaultStyle = framework ? DEFAULT_STYLE_BY_FRAMEWORK[framework] : 'less';
  const answer = await inquirer.prompt<{ style: Style }>([
    {
      type: 'list',
      name: 'style',
      message: '选择样式预处理语言',
      default: defaultStyle,
      choices: [
        { name: 'Less', value: 'less' },
        { name: 'SCSS', value: 'scss' },
        { name: 'Sass', value: 'sass' },
      ],
    },
  ]);
  return answer.style;
}

/* ---------------------- 主流程 ---------------------- */

async function main() {
  program
    .name(BIN)
    .description('快速创建 React / Vue 组件')
    .version(VERSION)
    .argument('<target-directory>', '目标目录')
    .argument('<component-name>', '组件名称')
    .option('--ts', '使用 TypeScript')
    .option('--js', '使用 JavaScript')
    .option(
      '--framework <framework>',
      '框架 (react|vue)，默认 react',
      'react',
    )
    .option(
      '--style <style>',
      '样式预处理语言 (less|scss|sass)，默认 react→less、vue→scss',
    )
    .option(
      '--type <type>',
      '组件类型 (simple|styled|complex)',
    );

  program.parse(process.argv);

  const options = program.opts();
  const [targetDirectory, componentName] = program.args;

  if (!targetDirectory || !componentName) {
    console.log(`Usage: ${BIN} <target-directory> <component-name>`);
    console.log('\nExample:');
    console.log(`  ${BIN} ./src/components Icon`);
    console.log(`  ${BIN} ./src/components UserCard --framework vue --style scss`);
    process.exit(1);
  }

  if (!validateComponentName(componentName)) {
    const error = getComponentNameError(componentName);
    console.log(`❌ 错误: ${error}`);
    console.log('\n组件名称必须使用大驼峰命名，例如:');
    console.log('  Icon, UserAvatar, DeviceStatus, LoginForm');
    process.exit(1);
  }

  // 解析框架：显式 flag 则直接用，否则进入交互式选择
  const frameworkFlag = normalizeFrameworkFlag(options.framework);
  let framework: Framework;
  if (frameworkFlag) {
    framework = frameworkFlag;
  } else {
    framework = await pickFramework();
  }

  // 解析语言：显式 flag 则直接用，否则进入交互式选择
  let language: Language;
  if (options.ts) {
    language = 'ts';
  } else if (options.js) {
    language = 'js';
  } else {
    language = await pickLanguage();
  }

  // 解析样式：
  //  - 显式 --style 直接用
  //  - 未指定时，若用户已显式给了 --framework（非交互意图）则静默用该框架默认样式
  //  - 否则进入交互式选择（携带框架默认值）
  const styleFlag = normalizeStyleFlag(options.style);
  let style: Style;
  if (styleFlag) {
    style = styleFlag;
  } else if (options.framework) {
    style = DEFAULT_STYLE_BY_FRAMEWORK[framework];
  } else {
    style = await pickStyle(undefined, framework);
  }

  // 交互式：组件类型
  let type: ComponentType;
  if (options.type && ['simple', 'styled', 'complex'].includes(options.type)) {
    type = options.type as ComponentType;
  } else {
    const answer = await inquirer.prompt<{ type: ComponentType }>([
      {
        type: 'list',
        name: 'type',
        message: '选择组件类型',
        choices: [
          { name: '简单组件', value: 'simple' },
          { name: '带样式组件', value: 'styled' },
          { name: '复杂组件', value: 'complex' },
        ],
      },
    ]);
    type = answer.type;
  }

  const result = generateComponent({
    targetDirectory,
    componentName,
    framework,
    language,
    style,
    type,
  });

  if (!result.success) {
    console.log(`\n❌ 错误: ${result.error}`);
    process.exit(1);
  }

  console.log('\n✔ 创建组件成功\n');
  console.log(`Component: ${componentName}`);
  console.log(`Framework: ${FRAMEWORK_LABELS[framework]}`);
  console.log(`Language:  ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`);
  console.log(`Style:     ${STYLE_LABELS[style]}`);
  console.log(`Type:      ${TYPE_NAMES[type]}`);
  console.log('\nCreated:');

  if (result.files) {
    result.files.forEach((file) => {
      const relativePath = file.replace(process.cwd() + '/', '');
      console.log(`  ${relativePath}`);
    });
  }

  console.log('');
}

main().catch((err) => {
  console.error('执行出错:', err);
  process.exit(1);
});
