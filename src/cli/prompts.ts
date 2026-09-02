import inquirer from 'inquirer';
import { Framework, Language, Style, ComponentType } from '../types';
import { t } from '../i18n/index';

/**
 * 交互式选择语言
 */
export async function pickLanguage(): Promise<Language> {
  const answer = await inquirer.prompt<{ language: Language }>([
    {
      type: 'list',
      name: 'language',
      message: t('prompt.selectLanguage'),
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' },
      ],
    },
  ]);
  return answer.language;
}

/**
 * 交互式选择框架
 */
export async function pickFramework(): Promise<Framework> {
  const answer = await inquirer.prompt<{ framework: Framework }>([
    {
      type: 'list',
      name: 'framework',
      message: t('prompt.selectFramework'),
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue 3', value: 'vue' },
      ],
    },
  ]);
  return answer.framework;
}

/**
 * 交互式选择样式
 */
export async function pickStyle(framework?: Framework): Promise<Style> {
  const defaultStyle = framework ? (framework === 'react' ? 'less' : 'scss') : 'less';
  const note = framework ? t('prompt.styleDefaultNote') : '';

  const answer = await inquirer.prompt<{ style: Style }>([
    {
      type: 'list',
      name: 'style',
      message: `${t('prompt.selectStyle')}${note}`,
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

/**
 * 交互式选择组件类型
 */
export async function pickType(): Promise<ComponentType> {
  const answer = await inquirer.prompt<{ type: ComponentType }>([
    {
      type: 'list',
      name: 'type',
      message: t('prompt.selectType'),
      choices: [
        { name: t('prompt.choiceSimple'), value: 'simple' },
        { name: t('prompt.choiceStyled'), value: 'styled' },
        { name: t('prompt.choiceComplex'), value: 'complex' },
      ],
    },
  ]);
  return answer.type;
}