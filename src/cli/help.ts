import { t } from '../i18n/index';

const BIN = 'scx';

/**
 * 输出带本地化的使用说明
 */
export function printUsage(missing?: 'target' | 'name'): void {
  const err = (s: string) => console.error(s);

  if (missing) {
    const which = missing === 'target' ? '<target-directory>' : '<component-name>';
    const full = missing === 'target'
      ? `${BIN} <target-directory> <component-name> [options]`
      : `${BIN} <component-name> [options]`;

    err(t('usage.missingArg', { arg: which }));
    err('');
    err(t('usage.needAnother'));
    err(`  ${full}`);
    err('');
    err(t('usage.description'));
    err(`  ${missing === 'target' ? t('usage.targetDesc') : t('usage.nameDesc')}`);
    err('');
    err(t('usage.example'));
    err(`  ${t('usage.example1')}`);
    err(`  ${t('usage.example2')}`);
  } else {
    err(t('usage.missingRequired'));
    err('');
    err(t('usage.fullUsage'));
    err(`  ${BIN} <target-directory> <component-name> [options]`);
    err('');
    err(t('usage.description'));
    err(`  ${t('usage.targetDir')}`);
    err(`  ${t('usage.componentName')}`);
    err('');
    err(t('usage.example'));
    err(`  ${t('usage.exampleShort')}`);
    err(`  ${t('usage.exampleFull')}`);
  }

  const opt = (o: string, key: string) => {
    err(`  ${o.padEnd(20)}${t(key)}`);
  };
  err('');
  err(t('usage.options'));
  opt('--ts', 'option.ts');
  opt('--js', 'option.js');
  opt('--framework <f>', 'option.framework');
  opt('--style <s>', 'option.style');
  opt('--type <t>', 'option.typeDesc');
  opt('-h, --help', 'option.help');
}