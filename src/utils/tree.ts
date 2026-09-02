/**
 * 将一组文件相对路径渲染成 tree 风格（├── / └── / │   /）的输出。
 *
 * 例如（rootTitle = "Test"）：
 *   Test
 *   ├── index.scss
 *   └── index.vue
 */

interface Node {
  name: string;
  children: Map<string, Node>;
}

function newNode(name: string): Node {
  return { name, children: new Map() };
}

function insert(root: Node, segments: string[]): void {
  let cur = root;
  for (const seg of segments) {
    if (!cur.children.has(seg)) cur.children.set(seg, newNode(seg));
    cur = cur.children.get(seg)!;
  }
}

/** 递归渲染一层节点。prefix 为祖先目录延续下来的缩进串。 */
function walk(nodes: Node[], prefix: string, lines: string[]): void {
  const sorted = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((node, idx) => {
    const last = idx === sorted.length - 1;
    if (node.children.size === 0) {
      lines.push(prefix + (last ? '└── ' : '├── ') + node.name);
      return;
    }
    lines.push(prefix + (last ? '└── ' : '├── ') + node.name);
    const childPrefix = prefix + (last ? '    ' : '│   ');
    walk([...node.children.values()], childPrefix, lines);
  });
}

/**
 * 把创建的绝对文件路径渲染成 tree 文本。
 * @param absoluteFiles 生成的绝对路径列表
 * @param baseDir 裁剪用的共同根目录（绝对值）
 * @returns 可直接 console.log 的多行字符串（不含尾随空行）
 */
export function renderTree(absoluteFiles: string[], baseDir: string): string {
  const normBase = baseDir.replace(/\/+$/, '');
  const relativeFiles = absoluteFiles.map((f) => {
    const resolved = f;
    if (resolved.startsWith(normBase + '/')) {
      return resolved.slice(normBase.length + 1);
    }
    // 兜底：取相对路径去掉 baseDir 前缀失败时用文件名
    return resolved.split('/').pop() ?? resolved;
  });

  const root = newNode('__root__');
  for (const rf of relativeFiles) {
    insert(root, rf.split('/').filter(Boolean));
  }

  const children = [...root.children.values()];
  const lines: string[] = [];

  // 若所有文件共享同一顶层目录（组件目录），把顶层作为树根标题打印，
  // 其余作为其下的子树（贴合需求里的 tree 打印形式）。
  if (children.length === 1 && children[0].children.size > 0) {
    const top = children[0];
    lines.push(top.name);
    walk([...top.children.values()], '', lines);
  } else {
    // 平铺的几个文件（例如 simple 类型同目录下的多个文件），无公共顶层
    walk(children, '', lines);
  }
  return lines.join('\n');
}
