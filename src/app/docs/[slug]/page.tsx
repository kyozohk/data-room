import { notFound } from 'next/navigation';
import { getDoc } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import DocBody from './DocBody';
import styles from './doc.module.css';

export const dynamic = 'force-dynamic';

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const { meta, content } = doc;

  let html = '';
  let toc: { id: string; text: string; depth: number }[] = [];
  let frontmatter: Record<string, any> = {};

  if (meta.ext === 'md') {
    const r = renderMarkdown(content);
    html = r.html;
    toc = r.toc;
    frontmatter = r.frontmatter;
  } else if (meta.ext === 'json') {
    const formatted = (() => {
      try { return JSON.stringify(JSON.parse(content), null, 2); } catch { return content; }
    })();
    html = `<pre class="hljs"><code class="language-json">${escapeHtml(formatted)}</code></pre>`;
  } else {
    // html — sandbox via iframe (set in DocBody)
    html = '';
  }

  const updated = new Date(meta.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <article className={styles.article}>
      <DocBody
        slug={meta.slug}
        title={meta.title}
        description={meta.description || frontmatter.description}
        category={meta.categoryLabel}
        updated={updated}
        toc={toc}
        html={html}
        rawHtml={meta.ext === 'html' ? content : undefined}
      />
    </article>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}
