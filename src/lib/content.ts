import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocMeta {
  slug: string;          // url-safe identifier, unique per doc
  category: string;      // 'technical' | 'company' | etc.
  categoryLabel: string;
  title: string;
  description?: string;
  filename: string;
  ext: 'md' | 'html' | 'json';
  order: number;
  updatedAt: number;
}

export interface DocCategory {
  id: string;
  label: string;
  icon: string;
  order: number;
}

const CATEGORY_META: Record<string, { label: string; icon: string; order: number }> = {
  technical: { label: 'Technical Docs', icon: 'FiCode', order: 1 },
  company: { label: 'Company', icon: 'FiBriefcase', order: 2 },
  legal: { label: 'Legal', icon: 'FiShield', order: 3 },
  finance: { label: 'Finance', icon: 'FiDollarSign', order: 4 },
};

export function getContentRoot(): string {
  return path.join(process.cwd(), 'content');
}

function humanizeFilename(name: string): string {
  const base = name.replace(/\.(md|html|json)$/i, '');
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function safeSlug(category: string, filename: string): string {
  const base = filename.replace(/\.(md|html|json)$/i, '');
  return `${category}__${base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
}

export function listDocs(): { categories: DocCategory[]; docs: DocMeta[] } {
  const root = getContentRoot();
  const docs: DocMeta[] = [];
  const seenCats = new Set<string>();

  if (!fs.existsSync(root)) return { categories: [], docs: [] };

  for (const cat of fs.readdirSync(root)) {
    const catDir = path.join(root, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    if (cat.startsWith('_') || cat.startsWith('.')) continue;
    const entries = fs.readdirSync(catDir).filter((f) =>
      /\.(md|html|json)$/i.test(f) && !f.startsWith('.')
    );
    if (entries.length === 0) continue;
    seenCats.add(cat);
    entries.forEach((filename, i) => {
      const full = path.join(catDir, filename);
      const stat = fs.statSync(full);
      const ext = (filename.match(/\.(md|html|json)$/i)?.[1] || 'md').toLowerCase() as DocMeta['ext'];
      let title = humanizeFilename(filename);
      let description: string | undefined;
      let order = i;

      if (ext === 'md') {
        try {
          const raw = fs.readFileSync(full, 'utf8');
          const fm = matter(raw);
          if (fm.data?.title) title = String(fm.data.title);
          if (fm.data?.description) description = String(fm.data.description);
          if (typeof fm.data?.order === 'number') order = fm.data.order;
          if (!fm.data?.title) {
            const m = fm.content.match(/^#\s+(.+)$/m);
            if (m) title = m[1].trim();
          }
        } catch { /* ignore */ }
      }

      docs.push({
        slug: safeSlug(cat, filename),
        category: cat,
        categoryLabel: CATEGORY_META[cat]?.label || humanizeFilename(cat),
        title,
        description,
        filename,
        ext,
        order,
        updatedAt: stat.mtimeMs,
      });
    });
  }

  const categories: DocCategory[] = Array.from(seenCats).map((id) => ({
    id,
    label: CATEGORY_META[id]?.label || humanizeFilename(id),
    icon: CATEGORY_META[id]?.icon || 'FiFolder',
    order: CATEGORY_META[id]?.order || 99,
  })).sort((a, b) => a.order - b.order);

  docs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return { categories, docs };
}

export function getDoc(slug: string): { meta: DocMeta; content: string } | null {
  const { docs } = listDocs();
  const meta = docs.find((d) => d.slug === slug);
  if (!meta) return null;
  const full = path.join(getContentRoot(), meta.category, meta.filename);
  if (!fs.existsSync(full)) return null;
  const content = fs.readFileSync(full, 'utf8');
  return { meta, content };
}
