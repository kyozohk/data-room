import { getOverviewStats } from '@/lib/analytics';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const stats = getOverviewStats();
  return <AdminDashboard stats={stats} />;
}
