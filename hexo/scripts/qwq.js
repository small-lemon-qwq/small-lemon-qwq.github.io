'use strict';

const { escapeHTML } = require('hexo-util');

const TYPES = new Set([
  'info',
  'success',
  'warning',
  'danger'
]);

let calloutSequence = 0;

const CALLOUT_MARKER_RE =
  /<!--hexo-callout:(start|end):([a-zA-Z0-9_-]+)-->/g;

/**
 * 临时保护已经生成的嵌套 callout。
 *
 * 输入：
 *   普通 Markdown
 *   <!--hexo-callout:start:c1-->
 *   <details>...</details>
 *   <!--hexo-callout:end:c1-->
 *
 * 输出：
 *   普通 Markdown
 *   <div data-hexo-callout-placeholder="xxx-0"></div>
 */
function protectNestedCallouts(source) {
  const token =
    `hco-${Date.now().toString(36)}-` +
    Math.random().toString(36).slice(2);

  const stack = [];
  const ranges = [];

  let topLevelStart = -1;
  let match;

  // RegExp 带有 g 标志，重复调用前重置 lastIndex。
  CALLOUT_MARKER_RE.lastIndex = 0;

  while ((match = CALLOUT_MARKER_RE.exec(source)) !== null) {
    const [, action, id] = match;

    if (action === 'start') {
      if (stack.length === 0) {
        topLevelStart = match.index;
      }

      stack.push(id);
      continue;
    }

    // 遇到不匹配的结束标记时，不直接破坏文章。
    if (stack.length === 0) {
      continue;
    }

    const expectedId = stack[stack.length - 1];

    if (expectedId !== id) {
      throw new Error(
        `callout 标记嵌套错误：期望结束 ${expectedId}，实际结束 ${id}`
      );
    }

    stack.pop();

    if (stack.length === 0) {
      ranges.push({
        start: topLevelStart,
        end: CALLOUT_MARKER_RE.lastIndex
      });

      topLevelStart = -1;
    }
  }

  if (stack.length > 0) {
    throw new Error(
      `callout 标记未闭合：${stack.join(', ')}`
    );
  }

  const blocks = [];
  let text = source;

  /*
   * 从后向前替换，避免前面的替换导致后续位置偏移。
   */
  for (let index = ranges.length - 1; index >= 0; index--) {
    const range = ranges[index];
    const block = source.slice(range.start, range.end);

    blocks[index] = block;

    const placeholder =
      `\n\n<div data-hexo-callout-placeholder="${token}-${index}"></div>\n\n`;

    text =
      text.slice(0, range.start) +
      placeholder +
      text.slice(range.end);
  }

  return {
    text,

    restore(renderedHtml) {
      const placeholderRe = new RegExp(
        `<div\\b[^>]*` +
          `data-hexo-callout-placeholder=` +
          `(?:"${escapeRegExp(token)}-(\\d+)"` +
          `|'${escapeRegExp(token)}-(\\d+)'` +
          `|${escapeRegExp(token)}-(\\d+))` +
          `[^>]*>\\s*<\\/div>`,
        'gi'
      );

      return renderedHtml.replace(
        placeholderRe,
        (placeholder, index1, index2, index3) => {
          const index = Number(index1 ?? index2 ?? index3);

          return blocks[index] ?? placeholder;
        }
      );
    }
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function unwrapSingleParagraph(html) {
  const value = String(html).trim();
  const match = value.match(/^<p>([\s\S]*)<\/p>$/);

  return match ? match[1] : value;
}

hexo.extend.tag.register(
  'callout',

  async function calloutTag(args, content) {
    const inputType = args.shift() || 'info';
    const type = TYPES.has(inputType)
      ? inputType
      : 'info';

    const rawTitle = args.join(' ').trim() || type;

    /*
     * 标题可以使用 Markdown：
     * {% callout info **标题** %}
     *
     * 先 escapeHTML，避免标题直接插入原始 HTML。
     */
    const renderedTitle = await hexo.render.render({
      text: escapeHTML(rawTitle),
      engine: 'markdown'
    });

    const title = unwrapSingleParagraph(renderedTitle);

    /*
     * 1. 取出内层 callout
     * 2. 替换成占位元素
     * 3. 只渲染剩余 Markdown
     * 4. 恢复内层 callout HTML
     */
    const protectedContent =
      protectNestedCallouts(content.trim());

    const renderedBody = await hexo.render.render({
      text: protectedContent.text,
      engine: 'markdown'
    });

    const body =
      protectedContent.restore(renderedBody).trim();

    const id = `c${++calloutSequence}`;

    /*
     * 标记必须保留，供上一层 callout 识别。
     * 不要缩进输出，降低被 Markdown 当成代码块的概率。
     */
    return [
      `<!--hexo-callout:start:${id}-->`,
      `<details class="callout callout-${type}">`,
      `<summary>${title}</summary>`,
      `<div class="callout-content">`,
      body,
      `</div>`,
      `</details>`,
      `<!--hexo-callout:end:${id}-->`
    ].join('\n');
  },

  {
    ends: true,
    async: true
  }
);