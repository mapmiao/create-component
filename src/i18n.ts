/**
 * 简易 i18n：根据系统语言判断中/英文，供 usage 与错误提示使用。
 *
 * 检测优先级：
 *  1. APP_LANG / SYS_LANG 环境变量（显式覆盖，便于测试与脚本指定，如 APP_LANG=zh）
 *  2. macOS：`defaults read NSGlobalDomain AppleLanguages`
 *  3. POSIX：$LC_ALL / $LC_MESSAGES / $LANG / $LANGUAGE
 *  4. 兜底英文
 */
import { execFileSync } from 'child_process';

export type Lang = 'zh' | 'en';

const zhPattern = /^(zh|cmn|zho)/i;

function normalize(locale: string | undefined): Lang {
  if (!locale) return 'en';
  return zhPattern.test(locale.trim()) ? 'zh' : 'en';
}

function readEnv(): string | undefined {
  // 保留：兼容旧调用（现主要由 resolveLang 直接分发）
  const v =
    process.env.APP_LANG ||
    process.env.SYS_LANG ||
    process.env.LC_ALL ||
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    process.env.LANGUAGE;
  return v || undefined;
}

function readMacAppleLanguages(): string | undefined {
  try {
    const out = execFileSync('defaults', ['read', 'NSGlobalDomain', 'AppleLanguages'], {
      encoding: 'utf8',
      timeout: 1500,
    });
    // 输出形如: ( "zh-Hans-CN", "en-CN", "zh-Hant-CN" )
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
  // 显式覆盖优先：便于脚本指定 APP_LANG=zh / APP_LANG=en
  const override = process.env.APP_LANG || process.env.SYS_LANG;
  if (override) return normalize(override);

  // macOS：以系统偏好语言为权威依据（zh-Hans-CN 等）。
  // 注意必须在 LANG/LC_ALL 之前：macOS 终端常把 LANG 置空或为 C/POSIX，不可靠。
  const apple = readMacAppleLanguages();
  if (apple) return normalize(apple);

  // 其余平台 / macOS 无 defaults：回退 POSIX locale。
  // 但 C / POSIX 是“无 locale”哨兵，不代表英文，不能据此判 en，继续往下找或默认英文。
  for (const key of ['LC_ALL', 'LC_MESSAGES', 'LANG', 'LANGUAGE']) {
    const v = process.env[key];
    if (!v) continue;
    const t = v.trim();
    if (!t || /^[cC]$|^POSIX$/i.test(t)) continue; // 跳过 C / POSIX
    return normalize(t);
  }

  return 'en';
}

/** 覆盖语言（测试 / 进程内切换） */
export function setLang(l: Lang): void {
  cached = l;
}

/** 返回语言下的一组短提示 */
export function localeText(): {
  zh: boolean;
  missingArg(target: string): string;
  pascalCaseExample: string;
} {
  const zh = detectLang() === 'zh';
  return {
    zh,
    pascalCaseExample: zh
      ? '组件名称必须使用大驼峰命名，例如: Icon, UserAvatar, DeviceStatus, LoginForm'
      : 'Component name must be PascalCase, e.g. Icon, UserAvatar, DeviceStatus, LoginForm',
    missingArg: (arg) =>
      zh
        ? `❌ 错误：缺少必填参数 ${arg}`
        : `❌ Error: missing required argument ${arg}`,
  };
}
