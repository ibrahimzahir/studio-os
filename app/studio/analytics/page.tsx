import { StudioShell } from '@/components/shared/studio-shell';
import { Dashboard } from '@/features/dashboard/components/dashboard';
import { requireUser } from '@/server/auth/current-user';
import { getDatabase } from '@/server/database/client';
import { opportunityDal } from '@/server/dal/opportunities';
export default async function Page() {
  const principal = await requireUser();
  const initial = await opportunityDal(getDatabase()).list(principal, { pageSize: 10 });
  return <StudioShell><Dashboard section="analytics" initial={initial} developer={principal.role === 'developer'} canCreate={principal.role !== 'viewer'} /></StudioShell>;
}
