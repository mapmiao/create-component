# create-react-component

一个简单的 CLI 工具，用于快速创建 React 组件。

## 安装

```bash
npm install -g create-react-component
```

或者使用 npm link 进行本地开发：

```bash
git clone <repo>
cd create-react-component
npm install
npm run build
npm link
```

## 使用

### 基础命令

```bash
cr <target-directory> <component-name>
```

### 示例

```bash
cr ./src/components Icon
```

执行后会提示选择：

1. **语言**：TypeScript 或 JavaScript
2. **组件类型**：简单组件、带样式组件、复杂组件

### 命令行参数

支持通过参数跳过交互式选择：

```bash
# 使用 TypeScript
cr ./src/components Icon --ts

# 使用 JavaScript
cr ./src/components Icon --js

# 指定组件类型
cr ./src/components Icon --type simple
cr ./src/components Icon --type styled
cr ./src/components Icon --type complex

# 组合使用
cr ./src/components Icon --ts --type styled
```

## 组件类型

### 简单组件

生成单个文件：

```text
Icon.tsx
```

内容：

```tsx
import React from 'react';

export default function Icon() {
  return <div>Icon</div>;
}
```

### 带样式组件

生成目录结构：

```text
Icon/
├── index.tsx
└── index.module.less
```

### 复杂组件

生成完整目录结构：

```text
Icon/
├── index.ts
├── Icon.tsx
├── index.module.less
├── hook/
│   └── useIcon.ts
└── utils/
    └── index.ts
```

## 组件命名规范

组件名称必须使用**大驼峰命名**（PascalCase）：

✅ 合法：
- `Icon`
- `UserAvatar`
- `DeviceStatus`
- `LoginForm`
- `UserInfoCard`

❌ 非法：
- `icon`（小写开头）
- `user-avatar`（包含连字符）
- `user_avatar`（包含下划线）
- `123Icon`（数字开头）

## 特性

- ✅ 支持 TypeScript 和 JavaScript
- ✅ 三种组件类型：简单、带样式、复杂
- ✅ 组件名称校验
- ✅ 组件已存在检测
- ✅ 自动创建目标目录
- ✅ 支持命令行参数跳过交互

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 编译
npm run build

# 运行
npm start
```

## License

MIT