import { Command } from 'commander';
import inquirer from 'inquirer';
import { validateComponentName, getComponentNameError } from './validator';
import { generateComponent } from './generator';
import { Language, ComponentType } from './types';

const program = new Command();

const TYPE_NAMES: Record<ComponentType, string> = {
  simple: '简单组件',
  styled: '带样式组件',
  complex: '复杂组件',
};

async function main() {
  program
    .name('cr')
    .description('快速创建 React 组件')
    .version('1.0.0')
    .argument('<target-directory>', '目标目录')
    .argument('<component-name>', '组件名称')
    .option('--ts', '使用 TypeScript')
    .option('--js', '使用 JavaScript')
    .option('--type <type>', '组件类型 (simple|styled|complex)');

  program.parse(process.argv);

  const options = program.opts();
  const [targetDirectory, componentName] = program.args;

  // 参数校验
  if (!targetDirectory || !componentName) {
    console.log('Usage: cr <target-directory> <component-name>');
    console.log('\nExample:');
    console.log('  cr ./src/components Icon');
    process.exit(1);
  }

  // 组件名称校验
  if (!validateComponentName(componentName)) {
    const error = getComponentNameError(componentName);
    console.log(`❌ 错误: ${error}`);
    console.log('\n组件名称必须使用大驼峰命名，例如:');
    console.log('  Icon, UserAvatar, DeviceStatus, LoginForm');
    process.exit(1);
  }

  // 交互式选择：语言
  let language: Language;
  if (options.ts) {
    language = 'ts';
  } else if (options.js) {
    language = 'js';
  } else {
    const answer = await inquirer.prompt<{
      language: Language;
    }>([
      {
        type: 'list',
        name: 'language',
        message: '选择语言',
        choices: [
          {
            name: 'TypeScript',
            value: 'ts' as Language,
          },
          {
            name: 'JavaScript',
            value: 'js' as Language,
          },
        ],
      },
    ]);
    language = answer.language;
  }

  // 交互式选择：组件类型
  let type: ComponentType;
  if (options.type && ['simple', 'styled', 'complex'].includes(options.type)) {
    type = options.type as ComponentType;
  } else {
    const answer = await inquirer.prompt<{
      type: ComponentType;
    }>([
      {
        type: 'list',
        name: 'type',
        message: '选择组件类型',
        choices: [
          {
            name: '简单组件',
            value: 'simple' as ComponentType,
          },
          {
            name: '带样式组件',
            value: 'styled' as ComponentType,
          },
          {
            name: '复杂组件',
            value: 'complex' as ComponentType,
          },
        ],
      },
    ]);
    type = answer.type;
  }

  // 生成组件
  const result = generateComponent({
    targetDirectory,
    componentName,
    language,
    type,
  });

  if (!result.success) {
    console.log(`\n❌ 错误: ${result.error}`);
    process.exit(1);
  }

  // 输出成功信息
  console.log('\n✔ 创建组件成功\n');
  console.log(`Component: ${componentName}`);
  console.log(`Language:  ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`);
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