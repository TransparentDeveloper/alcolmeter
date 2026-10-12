// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

/** @param {{ source: string }} file */
const keepSingleTilde = (file) => ({
  name: 'keep-single-tilde',
  options: { position: true },
  /**
   * @param {{ position?: { start: { offset?: number } }, children: object[] }} node
   * @param {{ replaceNode(node: object, nodes: object[]): void }} ctx
   */
  delete(node, ctx) {
    const start = node.position?.start.offset;
    if (start === undefined || file.source.startsWith('~~', start)) return;
    ctx.replaceNode(node, [{ type: 'text', value: '~' }, ...node.children, { type: 'text', value: '~' }]);
  },
});

/** @type {import('astro').AstroIntegration} */
const singleTildeAsText = {
  name: 'single-tilde-as-text',
  hooks: {
    'astro:config:setup': ({ config }) => {
      const { processor } = config.markdown;
      // satteri 에는 한 개 물결 취소선을 끄는 옵션이 없어 기본 처리기에 플러그인을 직접 단다.
      if (processor.name !== 'satteri') throw new Error(`single-tilde-as-text: satteri 처리기가 아니다(${processor.name})`);
      const { mdastPlugins } = processor.options;
      if (!Array.isArray(mdastPlugins)) throw new Error(`single-tilde-as-text: satteri 처리기의 options.mdastPlugins 가 배열이 아니다(${typeof mdastPlugins}). satteri 버전이 바뀌었는지 확인한다`);
      mdastPlugins.push(keepSingleTilde);
    },
  },
};

export default defineConfig({
  site: 'https://alcolmeter.kr',
  trailingSlash: 'never',
  integrations: [singleTildeAsText, mdx(), sitemap()],
});
