import { StudioShell } from '@/components/shared/studio-shell';
import { Dashboard } from '@/features/dashboard/components/dashboard';
import { requireUser } from '@/server/auth/current-user';
import { getDatabase } from '@/server/database/client';
import { opportunityDal } from '@/server/dal/opportunities';
import { loadPilotDraftManifest } from '@/server/drafts/load-draft-manifest';

export default async function Studio() {
  const principal = await requireUser();
  const [initial, draftPackage] = await Promise.all([
    opportunityDal(getDatabase()).list(principal, { pageSize: 2 }),
    loadPilotDraftManifest(),
  ]);
  return (
    <StudioShell>
      <Dashboard
        initial={initial}
        developer={principal.role === 'developer'}
        canCreate={principal.role !== 'viewer'}
        draftPackage={draftPackage}
      />
    </StudioShell>
  );
}
