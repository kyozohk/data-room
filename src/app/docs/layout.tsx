import { listDocs } from '@/lib/content';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Tracker from '@/components/Tracker';
import styles from './layout.module.css';

export const dynamic = 'force-dynamic';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const { categories, docs } = listDocs();
  return (
    <div className={styles.shell}>
      <Sidebar categories={categories} docs={docs} />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>{children}</div>
      </div>
      <Tracker />
    </div>
  );
}
