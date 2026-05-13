import { listDocs } from '@/lib/content';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

export default function DocsLanding() {
  const { categories, docs } = listDocs();
  return <LandingClient categories={categories} docs={docs} />;
}
