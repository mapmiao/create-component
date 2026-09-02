# create-component

一个简单的 CLI 工具，用于快速创建 **React / Vue** 组件，支持 Less / SCSS 多种样式。

## 特性

- 🎯 多框架：React、Vue 3（未来可扩展）
- 🎨 多种样式：Less / SCSS / Sass
- 🧠 智能默认：React 默认 Less，Vue 默认 SCSS
- 📦 三种组件类型：简单 / 带样式 / 复杂
- 🚀 TypeScript / JavaScript 均支持
- ⚡ 全参数可非交互式（适合脚本）
- 🧭 也可完全交互式引导（适合手动使用）
- 🌳 创建结果以 `tree` 风格输出（`├── / └──`）
- 🌐 提示信息自动国际化：根据系统语言输出中文 / 英文
- 📌 参数缺失时给出友好、可用的提示与示例（而非冰冷英文报错）

## 安装

```bash
npm install -g create-component
```

或本地开发（npm link）：

```bash
git clone <repo>
cd create-component
npm install
npm run build
npm link
```

## 使用

### 基础命令

```bash
scx <target-directory> <component-name>
```

不传参数时会交互式引导选择：

```bash
scx ./src/components Icon
```

### 命令行参数

```bash
# 指定框架（默认 react）
scx ./src/components Icon --framework react
scx ./src/components Icon --framework vue

# 指定样式预处理语言（默认 react→less、vue→scss）
scx ./src/components Icon --style less
scx ./src/components Icon --style scss
scx ./src/components Icon --style sass

# 使用 TypeScript / JavaScript
scx ./src/components Icon --ts
scx ./src/components Icon --js

# 指定组件类型
scx ./src/components Icon --type simple
scx ./src/components Icon --type styled
scx ./src/components Icon --type complex

# 全参数组合（非交互，适合脚本）
scx ./src/components Button --framework vue --ts --style scss --type complex
scx ./src/components UserCard --ts --type styled            # react + less
```

### 完整示例

创建一个 Vue + TypeScript + SCSS 的复杂组件：

```bash
scx ./src/components UserPanel --framework vue --ts --style scss --type complex
```

生成：

```text
UserPanel/
├── UserPanel.vue              # 主组件 SFC
├── composable/
│   └── useUserPanel.ts        # 组合式函数
├── utils/
│   └── index.ts               # 工具函数
├── index.ts                   # 入口（具名导出）
└── index.scss                 # 样式（scoped @import）
```

创建一个 React + TS + Less 的复杂组件：

```bash
scx ./src/components LoginForm --ts --type complex
```

生成：

```text
LoginForm/
├── LoginForm.tsx              # 主组件
├── hook/
│   └── useLoginForm.ts        # 自定义 Hook
├── utils/
│   └── index.ts               # 工具函数
├── index.ts                   # 入口
└── index.module.less          # CSS Module 样式
```

## 组件类型

### 简单组件 simple

生成单个独立文件（React）或单个 SFC（Vue）。

- React：`Icon.tsx` / `Icon.jsx`
- Vue：`Icon.vue`

### 带样式组件 styled

组件 + 独立样式文件。

- React：目录 + `index.module.less`（CSS Module）
- Vue：目录 + `index.scss`（scoped `@import`）

### 复杂组件 complex

组件 + 逻辑抽取 + 工具函数 + 样式。

- React 目录约定：`hook/`（自定义 Hook）+ `utils/`
- Vue 目录约定：`composable/`（组合式函数）+ `utils/`

## 使用约定

- 组件名称使用**大驼峰命名**（PascalCase），如 `Icon`、`UserAvatar`、`LoginForm`
- React 复杂组件逻辑隔离在 `hook/`，遵循 React 领域惯例
- Vue 复杂组件逻辑隔离在 `composable/`，遵循 Vue 领域惯例
- CSS 类名由组件名自动转为首字母小写（camelCase），如 `UserAvatar` → `.userAvatar`

## 开发

```bash
npm install
npm run dev            # tsx 直接运行（热开发）
npm run build          # 编译到 dist/
npm link               # 全局链接命令 scx
```

## License

MIT
