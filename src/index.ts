import { Command, CommanderError } from 'commander';
import path from 'path';
import inquirer from 'inquirer';
import { validateComponentName, getComponentNameError } from './validator';
import { getComponentNameErrorEn } from './validator-i18n';
import { generateComponent, findExistingConflict } from './generator';
import { renderTree } from './tree';
import {
  ComponentType,
  Framework,
  Language,
  Style,
  DEFAULT_STYLE_BY_FRAMEWORK,
  FRAMEWORK_LABELS,
  STYLE_LABELS,
} from './types';
import { detectLang } from './i18n';

const BIN = 'scx';
const VERSION = '1.1.0';

// 组件类型的本地化名称
const TYPE_LABELS: Record<ComponentType, { zh: string; en: string }> = {
  simple: { zh: '简单组件', en: 'simple' },
  styled: { zh: '带样式组件', en: 'styled' },
  complex: { zh: '复杂组件', en: 'complex' },
};

function typeLabel(t: ComponentType): string {
  return detectLang() === 'zh' ? TYPE_LABELS[t].zh : TYPE_LABELS[t].en;
}

/* ---------------------- 交互式提示（本地化） ---------------------- */

/* 常用词表（交互提示文案 + 选项显示名） */
function i18nStrings() {
  const zh = detectLang() === 'zh';
  return {
    zh,
    // 语言
    langMsg: zh ? '选择语言' : 'Select language',
    // 框架
    frameworkMsg: zh ? '选择框架' : 'Select framework',
    reactName: 'React',
    vueName: 'Vue 3',
    // 样式
    styleMsg: zh ? '选择样式预处理语言' : 'Select style preprocessor',
    styleDefaultNote: zh ? '（当前框架默认）' : ' (framework default)',
    // 类型
    typeMsg: zh ? '选择组件类型' : 'Select component type',
    choiceSimple: zh ? '简单组件 (simple)' : 'Simple (simple)',
    choiceStyled: zh ? '带样式组件 (styled)' : 'Styled (styled)',
    choiceComplex: zh ? '复杂组件 (complex)' : 'Complex (complex)',
  };
}

async function pickLanguage(flag?: string): Promise<Language> {
  if (flag === 'ts') return 'ts';
  if (flag === 'js') return 'js';
  const S = i18nStrings();
  const answer = await inquirer.prompt<{ language: Language }>([
    {
      type: 'list',
      name: 'language',
      message: S.langMsg,
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
  const S = i18nStrings();
  const answer = await inquirer.prompt<{ framework: Framework }>([
    {
      type: 'list',
      name: 'framework',
      message: S.frameworkMsg,
      choices: [
        { name: S.reactName, value: 'react' },
        { name: S.vueName, value: 'vue' },
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
  const S = i18nStrings();
  const answer = await inquirer.prompt<{ style: Style }>([
    {
      type: 'list',
      name: 'style',
      message: `${S.styleMsg}${framework ? S.styleDefaultNote : ''}`,
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

/* ---------------------- 本地化的 usage 帮助 ---------------------- */

/** 输出带本地化的使用说明（可指定哪一个参数缺失） */
function printUsage(missing?: 'target' | 'name'): void {
  const zh = detectLang() === 'zh';
  const err = (s: string) => console.error(s);

  if (missing) {
    const which =
      missing === 'target' ? '<target-directory>' : '<component-name>';
    const full =
      missing === 'target' ? `${BIN} <target-directory> <component-name> [options]` : `${BIN} <component-name> [options]`;

    if (zh) {
      err(`❌ 错误：缺少必填参数 ${which}`);
      err('');
      err(`还需要再给一个位置参数，完整命令是：`);
      err(`  ${full}`);
      err('');
      err(`说明：`);
      err(
        missing === 'target'
          ? `  <target-directory>  组件要创建到的目标目录（可含多级路径，自动创建）`
          : `  <component-name>    组件名称，大驼峰命名，如 Icon / UserAvatar / DeviceStatus`,
      );
      err('');
      err('完整示例：');
      err(`  ${BIN} ./src/components MyComponent --framework vue --style scss`);
      err(`  ${BIN} ./src/components/Icon --type simple`);
    } else {
      err(`❌ Error: missing required argument ${which}`);
      err('');
      err(`A positional argument is still needed. Full usage:`);
      err(`  ${full}`);
      err('');
      err(missing === 'target'
        ? `  <target-directory>  directory the component is created in (auto-created)`
        : `  <component-name>    component name, PascalCase, e.g. Icon / UserAvatar / DeviceStatus`);
      err('');
      err('Full examples:');
      err(`  ${BIN} ./src/components MyComponent --framework vue --style scss`);
      err(`  ${BIN} ./src/components/Icon --type simple`);
    }
  } else {
    // 通用用法
    if (zh) {
      err('❌ 错误：缺少必填参数');
      err('');
      err('用法：');
      err(`  ${BIN} <target-directory> <component-name> [options]`);
      err('');
      err('说明：');
      err(`  <target-directory>  组件要创建到的目标目录`);
      err(`  <component-name>    组件名称，大驼峰命名，如 Icon`);
      err('');
      err('示例：');
      err(`  ${BIN} ./src/components Icon`);
      err(`  ${BIN} ./src/components UserCard --framework vue --style scss`);
    } else {
      err('❌ Error: missing required arguments');
      err('');
      err('Usage:');
      err(`  ${BIN} <target-directory> <component-name> [options]`);
      err('');
      err('Args:');
      err(`  <target-directory>  target directory`);
      err(`  <component-name>    component name (PascalCase), e.g. Icon`);
      err('');
      err('Examples:');
      err(`  ${BIN} ./src/components Icon`);
      err(`  ${BIN} ./src/components UserCard --framework vue --style scss`);
    }
  }

  // 通用选项（双语）
  const opt = (o: string, zhTxt: string, enTxt: string) => {
    const arrow = zh ? '        ' : '        ';
    err(`  ${o.padEnd(20)}${zh ? zhTxt : enTxt}`);
  };
  err('');
  err(zh ? 'Options:' : 'Options:');
  opt('--ts', '使用 TypeScript', 'use TypeScript');
  opt('--js', '使用 JavaScript', 'use JavaScript');
  opt('--framework <f>', '框架 (react|vue)', 'framework (react|vue)');
  opt('--style <s>', '样式 (less|scss|sass)', 'style (less|scss|sass)');
  opt('--type <t>', '类型 (simple|styled|complex) 默认 complex', 'type (simple|styled|complex), default complex');
  opt('-h, --help', '查看帮助', 'show help');
}

/* ---------------------- 主流程 ---------------------- */

async function main(): Promise<void> {
  const zh = detectLang() === 'zh';

  const program = new Command();

  program
    .name(BIN)
    .description(zh ? '快速创建 React / Vue 组件' : 'Quickly create React / Vue components')
    .version(VERSION)
    // 两个位置参数都声明为可选，避免 commander 输出英文缺参报错；缺参由我们自己本地化处理
    .argument('[target-directory]', zh ? '目标目录' : 'target directory')
    .argument('[component-name]', zh ? '组件名称' : 'component name')
    .option('--ts', zh ? '使用 TypeScript' : 'use TypeScript')
    .option('--js', zh ? '使用 JavaScript' : 'use JavaScript')
    .option('--framework <framework>', zh ? '框架 (react|vue)，不指定则交互式选择' : 'framework (react|vue)')
    .option('--style <style>', zh ? '样式 (less|scss|sass)' : 'style (less|scss|sass)')
    .option('--type <type>', zh ? '类型 (simple|styled|complex)' : 'type (simple|styled|complex)');

  let targetDirectory: string | undefined;
  let componentName: string | undefined;

  try {
    program.exitOverride();
    program.parse(process.argv);
    [targetDirectory, componentName] = [...program.args];
  } catch (err) {
    if (err instanceof CommanderError) {
      // -h / --help 与 -V / --version 已正常打印，静默退出
      if (err.code === 'commander.helpDisplayed' || err.code === 'commander.version') {
        process.exit(0);
      }
      // 未知选项等 commander 报错 → 本地化输出 usage
      printUsage();
      process.exitCode = 1;
      return;
    }
    throw err;
  }

  // 手动缺参检查（本地化）
  if (!targetDirectory) {
    if (componentName && componentName.startsWith('-') === false) {
      // 用户给了一个名字但少了目标目录
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

  const options = program.opts();

  // 组件名校验（本地化）
  if (!validateComponentName(componentName)) {
    const msg = zh
      ? getComponentNameError(componentName)
      : getComponentNameErrorEn(componentName);
    if (zh) {
      console.error(`❌ 错误: ${msg}`);
      console.error('');
      console.error('组件名称必须使用大驼峰命名，例如:');
      console.error('  Icon, UserAvatar, DeviceStatus, LoginForm');
    } else {
      console.error(`❌ Error: ${msg}`);
      console.error('');
      console.error('Component name must be PascalCase. e.g.');
      console.error('  Icon, UserAvatar, DeviceStatus, LoginForm');
    }
    process.exitCode = 1;
    return;
  }

  // —— 目标目录同名组件检查：在任何交互选择之前就拦截——
  // 所有框架 / 类型 / 语言都可能产生同名产物（目录 / Name.vue / Name.tsx / Name.jsx），
  // 只要命中其一即判定“已存在”，避免用户把选项全选完才被告知冲突。
  const conflict = findExistingConflict(targetDirectory, componentName);
  if (conflict) {
    if (zh) {
      console.error(`❌ 错误: 组件 "${componentName}" 已存在于 ` + conflict);
      console.error('如需重新生成，请先删除同名组件或换一个名称。');
    } else {
      console.error(`❌ Error: component "${componentName}" already exists at ` + conflict);
      console.error('Delete the existing component or use another name to continue.');
    }
    process.exitCode = 1;
    return;
  }

  // 框架 / 语言 / 样式 / 类型解析（交互交互式提示保持与原先一致，中文 UI）
  const frameworkFlag = normalizeFrameworkFlag(options.framework);
  let framework: Framework;
  if (frameworkFlag) {
    framework = frameworkFlag;
  } else {
    framework = await pickFramework();
  }

  let language: Language;
  if (options.ts) {
    language = 'ts';
  } else if (options.js) {
    language = 'js';
  } else {
    language = await pickLanguage();
  }

  const styleFlag = normalizeStyleFlag(options.style);
  let style: Style;
  if (styleFlag) {
    style = styleFlag;
  } else if (options.framework) {
    style = DEFAULT_STYLE_BY_FRAMEWORK[framework];
  } else {
    style = await pickStyle(undefined, framework);
  }

  let type: ComponentType;
  if (options.type && ['simple', 'styled', 'complex'].includes(options.type)) {
    type = options.type as ComponentType;
  } else {
    const S = i18nStrings();
    const typeChoices = [
      { name: S.choiceSimple, value: 'simple' as ComponentType },
      { name: S.choiceStyled, value: 'styled' as ComponentType },
      { name: S.choiceComplex, value: 'complex' as ComponentType },
    ];
    const answer = await inquirer.prompt<{ type: ComponentType }>([
      {
        type: 'list',
        name: 'type',
        message: S.typeMsg,
        choices: typeChoices,
      },
    ]);
    type = answer.type;
  }

  const result = generateComponent(
    { targetDirectory, componentName, framework, language, style, type },
    detectLang(),
  );

  if (!result.success) {
    if (zh) {
      console.log(`\n❌ 错误: ${result.error}`);
    } else {
      console.log(`\n❌ Error: ${result.error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`\n${zh ? '✔ 创建组件成功' : '✔ Component created successfully'}\n`);
  if (zh) {
    console.log(`组件名称: ${componentName}`);
    console.log(`框架: ${FRAMEWORK_LABELS[framework]}`);
    console.log(`语言: ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`);
    console.log(`样式: ${STYLE_LABELS[style]}`);
    console.log(`类型: ${typeLabel(type)}`);
  } else {
    console.log(`Component: ${componentName}`);
    console.log(`Framework: ${FRAMEWORK_LABELS[framework]}`);
    console.log(`Language:  ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`);
    console.log(`Style:     ${STYLE_LABELS[style]}`);
    console.log(`Type:      ${typeLabel(type)}`);
  }
  console.log('');
  console.log(zh ? '已创建:' : 'Created:');

  if (result.files && result.files.length > 0) {
    // 以绝对化后的目标目录为基准裁相对路径，渲染 tree。
    // 注意 targetDirectory 可能是相对路径(./foo)，必须 resolve 才能与 files 的绝对路径匹配。
    const baseAbs = path.resolve(targetDirectory);
    console.log(renderTree(result.files, baseAbs));
  }

  console.log('');
}

main().catch((err) => {
  const zh = detectLang() === 'zh';
  console.error(zh ? '执行出错:' : 'Error:', err);
  process.exitCode = 1;
});


