import { StudioShell } from '@/components/shared/studio-shell';
import { Dashboard } from '@/features/dashboard/components/dashboard';
import { requireUser } from '@/server/auth/current-user';
import { getDatabase } from '@/server/database/client';
import { opportunityDal } from '@/server/dal/opportunities';
import { loadAllDraftManifests } from '@/server/drafts/load-draft-manifest';

export default async function Page() {
  const principal = await requireUser();
  const [initial, draftPackages] = await Promise.all([
    opportunityDal(getDatabase()).list(principal, { pageSize: 10 }),
    loadAllDraftManifests(),
  ]);
  return (
    <StudioShell>
      <Dashboard
        section="pipeline"
        initial={initial}
        developer={principal.role === 'developer'}
        canCreate={principal.role !== 'viewer'}
        draftPackage={draftPackages.find((p) => p.assetRootKey === 'mobile-detailing') ?? draftPackages[0] ?? null}
        draftPackages={draftPackages}
      />
    </StudioShell>
  );
}
