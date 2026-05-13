import { Marked } from 'marked';
import matter from 'gray-matter';
import hljs from 'highlight.js';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface RenderedMarkdown {
  html: string;
  toc: { id: string; text: string; depth: number }[];
  frontmatter: Record<string, any>;
}

export function renderMarkdown(raw: string): RenderedMarkdown {
  const fm = matter(raw);
  const toc: RenderedMarkdown['toc'] = [];
  const seen = new Map<string, number>();

  // Use a fresh Marked instance per call so toc/seen don't leak across renders.
  const marked = new Marked({
    gfm: true,
    breaks: false,
  });

  marked.use({
    renderer: {
      heading(this: any, token: any): string {
        const depth: number = token.depth;
        const plain: string = (token.text || '').toString();
        let id = slugify(plain) || `h${depth}`;
        if (seen.has(id)) {
          const n = (seen.get(id) || 0) + 1;
          seen.set(id, n);
          id = `${id}-${n}`;
        } else {
          seen.set(id, 0);
        }
        toc.push({ id, text: plain, depth });
        const inner = this.parser.parseInline(token.tokens);
        return `<h${depth} id="${id}" data-section="${id}">${inner}</h${depth}>\n`;
      },
      code(this: any, token: any): string {
        const lang = (token.lang || '').toString().trim().toLowerCase().split(/\s+/)[0];
        const text: string = token.text || '';
        let highlighted: string;
        try {
          if (lang && hljs.getLanguage(lang)) {
            highlighted = hljs.highlight(text, { language: lang, ignoreIllegals: true }).value;
          } else {
            highlighted = hljs.highlightAuto(text).value;
          }
        } catch {
          highlighted = escapeHtml(text);
        }
        return `<pre class="hljs"><code class="language-${escapeHtml(lang)}">${highlighted}</code></pre>\n`;
      },
      link(this: any, token: any): string {
        const href: string = token.href || '';
        const title: string = token.title || '';
        const inner = this.parser.parseInline(token.tokens);
        const isExternal = /^https?:\/\//.test(href);
        const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return `<a href="${escapeHtml(href)}"${t}${attrs}>${inner}</a>`;
      },
    },
  });

  const html = marked.parse(fm.content) as string;

  return { html, toc, frontmatter: fm.data || {} };
}
