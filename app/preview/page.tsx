import { StudioShell } from '@/components/shared/studio-shell';
import { Dashboard } from '@/features/dashboard/components/dashboard';
import { opportunityPageSchema } from '@/contracts/opportunities';
import { loadPilotDraftManifest } from '@/server/drafts/load-draft-manifest';

const initial = opportunityPageSchema.parse({
  items: [
    {
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Mobile detailing planner',
      audience: 'Independent mobile detailers (US initial hypothesis · internal pilot v0.1.0-draft)',
      category: 'operations',
      status: 'needs_research',
      createdAt: '2026-11-24T00:00:00Z',
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      title: 'Short-term rental welcome guide',
      audience: 'Independent vacation-rental and guesthouse hosts (comparative 24 Nov signal)',
      category: 'hospitality',
      status: 'needs_research',
      createdAt: '2026-11-24T00:00:00Z',
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      title: 'Family caregiver organization binder',
      audience: 'Adults coordinating family care and appointments (non-medical organization)',
      category: 'operations',
      status: 'needs_research',
      createdAt: '2026-11-24T00:00:00Z',
    },
  ],
  total: 3,
  page: 1,
  pageSize: 2,
});

export default async function Preview() {
  const draftPackage = await loadPilotDraftManifest();
  return (
    <StudioShell preview>
      <Dashboard initial={initial} preview draftPackage={draftPackage} />
    </StudioShell>
  );
}
