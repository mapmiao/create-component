import { execFileSync } from 'child_process';

export type Lang = 'zh' | 'en';

// 导入国际化资源
// @ts-ignore
import zhCN from './locales/zh-CN.json';
// @ts-ignore
import enUS from './locales/en-US.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<string, any> = {
  'zh': zhCN,
  'en': enUS,
};

const zhPattern = /^(zh|cmn|zho)/i;

function normalize(locale: string | undefined): Lang {
  if (!locale) return 'en';
  return zhPattern.test(locale.trim()) ? 'zh' : 'en';
}

function readMacAppleLanguages(): string | undefined {
  try {
    const out = execFileSync('defaults', ['read', 'NSGlobalDomain', 'AppleLanguages'], {
      encoding: 'utf8',
      timeout: 1500,
    });
    const m = out.match(/"([^"]+)"/);
    return m ? m[1] : undefined;
  } catch {
    return undefined;
  }
}

let cached: Lang | null = null;

/** 检测当前语言（结果进程内缓存） */
export function detectLang(): Lang {
  if (cached) return cached;
  cached = resolveLang();
  return cached;
}

function resolveLang(): Lang {
  // 显式覆盖优先
  const override = process.env.APP_LANG || process.env.SYS_LANG;
  if (override) return normalize(override);

  // macOS 系统语言
  const apple = readMacAppleLanguages();
  if (apple) return normalize(apple);

  // POSIX locale
  for (const key of ['LC_ALL', 'LC_MESSAGES', 'LANG', 'LANGUAGE']) {
    const v = process.env[key];
    if (!v) continue;
    const t = v.trim();
    if (!t || /^[cC]$|^POSIX$/i.test(t)) continue;
    return normalize(t);
  }

  return 'en';
}

/** 覆盖语言（测试 / 进程内切换） */
export function setLang(l: Lang): void {
  cached = l;
}

/**
 * 获取国际化文本
 * @param key - 点分隔的键名，如 'cli.created' 或 'error.componentExists'
 * @param vars - 变量替换，如 { name: 'Button', path: './src' }
 * @returns 翻译后的文本
 */
export function t(key: string, vars?: Record<string, string>): string {
  const lang = detectLang();
  const keys = key.split('.');
  let text: unknown = messages[lang];

  for (const k of keys) {
    if (typeof text === 'object' && text !== null && k in text) {
      text = (text as Record<string, unknown>)[k];
    } else {
      return key; // 找不到返回 key 本身
    }
  }

  if (typeof text !== 'string') {
    return key;
  }

  // 变量替换
  if (vars) {
    let result = text;
    Object.entries(vars).forEach(([k, v]) => {
      result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
    return result;
  }

  return text;
}