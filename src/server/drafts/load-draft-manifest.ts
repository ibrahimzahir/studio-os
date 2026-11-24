import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

export const draftArtifactSchema = z.object({
  filename: z.string(),
  mediaType: z.string(),
  byteSize: z.number().int().nonnegative(),
  sha256: z.string(),
});

export const draftPinSchema = z.object({
  id: z.string(),
  filename: z.string(),
  title: z.string(),
  description: z.string(),
  altText: z.string(),
  destinationSlug: z.string(),
  destinationUrlPlaceholder: z.string(),
  proposedBoard: z.string(),
  status: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  byteSize: z.number().int().nonnegative(),
  sha256: z.string(),
  mediaType: z.string(),
});

export const draftManifestSchema = z.object({
  schemaVersion: z.string(),
  productSlug: z.string(),
  revision: z.string(),
  classification: z.string(),
  demandValidated: z.boolean(),
  testPriceHypothesisUsd: z.number(),
  status: z.string(),
  automaticPublishing: z.boolean(),
  qaReportPath: z.string(),
  artifacts: z.array(draftArtifactSchema),
  pinterestDrafts: z.array(draftPinSchema),
  qaSummary: z.object({
    pdfRenderingPassed: z.boolean(),
    pdfSafetyAndAcroFormPassed: z.boolean(),
    xlsxSecurityScanPassed: z.boolean(),
    xlsxEngineRecalculationStatus: z.string(),
    missingQaTools: z.array(z.string()),
    formulaFixturePythonDecimalPassed: z.boolean(),
    pinterestDraftDimensionsPassed: z.boolean(),
  }),
  unresolvedBlockers: z.array(z.string()),
});

export type DraftManifest = z.infer<typeof draftManifestSchema>;

const PRODUCT_MANIFEST_DIRS = [
  { key: 'str-welcome-guide', rel: ['antigravity', 'str-welcome-guide', 'output', 'v0.1.0-draft', 'manifest.json'] },
  { key: 'mobile-detailing', rel: ['antigravity', 'mobile-detailing', 'output', 'v0.1.0-draft', 'manifest.json'] },
] as const;

export type DraftManifestWithKey = DraftManifest & { assetRootKey: string };

async function readManifestFile(rel: readonly string[], assetRootKey: string): Promise<DraftManifestWithKey | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), ...rel), 'utf8');
    const parsed = draftManifestSchema.safeParse(JSON.parse(raw));
    return parsed.success ? { ...parsed.data, assetRootKey } : null;
  } catch {
    return null;
  }
}

export async function loadPilotDraftManifest(): Promise<DraftManifest | null> {
  return readManifestFile(
    ['antigravity', 'mobile-detailing', 'output', 'v0.1.0-draft', 'manifest.json'],
    'mobile-detailing',
  );
}

export async function loadAllDraftManifests(): Promise<DraftManifestWithKey[]> {
  const loaded = await Promise.all(PRODUCT_MANIFEST_DIRS.map((d) => readManifestFile(d.rel, d.key)));
  return loaded.filter((m): m is DraftManifestWithKey => m !== null);
}
