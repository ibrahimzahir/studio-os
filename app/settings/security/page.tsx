import { ArrowLeftIcon, CheckCircle2Icon, LockKeyholeIcon, ShieldCheckIcon } from 'lucide-react';
import { StudioLogoMark } from '@/components/shared/studio-logo';
import { StudioShell } from '@/components/shared/studio-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoFactorSetup } from '@/features/auth/components/two-factor-setup';
import { requireUser } from '@/server/auth/current-user';

export default async function Security() {
  const user = await requireUser(false);

  if (!user.twoFactorEnabled) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-10">
        <div className="flex items-center gap-3">
          <StudioLogoMark className="size-8 rounded-lg shadow-xs" />
          <div className="leading-none">
            <span className="block text-sm font-semibold tracking-tight text-foreground">Studio OS</span>
            <span className="mt-1 block text-xs text-muted-foreground">Account security</span>
          </div>
        </div>

        <Card className="border-border/90 shadow-xs">
          <CardHeader className="border-b border-border/70 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <ShieldCheckIcon className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="text-base font-semibold tracking-tight">Protect your studio account</CardTitle>
            </div>
            <CardDescription className="mt-1 text-sm">
              Two-factor authentication is required before accessing studio data.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TwoFactorSetup />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <StudioShell>
      <div className="flex flex-col gap-7">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[26px]">
                Account &amp; security
              </h1>
              <Badge variant="outline" className="gap-1.5 font-normal text-muted-foreground">
                <LockKeyholeIcon className="size-3" aria-hidden="true" />
                Private workspace
              </Badge>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Manage two-factor authentication and session protection for your studio account.
            </p>
          </div>

          <Button variant="outline" size="sm" nativeButton={false} render={<a href="/studio" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Return to studio
          </Button>
        </div>

        <Card className="max-w-2xl border-border/90 shadow-xs">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <ShieldCheckIcon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="text-base font-semibold tracking-tight">Two-factor authentication</CardTitle>
                <CardDescription className="mt-0.5 text-sm">
                  TOTP authenticator verification is required for all studio access.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1.5 font-medium">
              <CheckCircle2Icon className="size-3.5 text-primary" aria-hidden="true" />
              Enabled
            </Badge>
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            <dl className="grid gap-4 rounded-xl border border-border/70 bg-muted/30 p-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1 font-medium text-foreground">Verified &amp; active</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Role</dt>
                <dd className="mt-1 font-medium capitalize text-foreground">{user.role}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Method</dt>
                <dd className="mt-1 font-medium text-foreground">Authenticator app (TOTP)</dd>
              </div>
            </dl>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Keep your single-use recovery codes stored safely in your password manager. Sensitive studio actions
              require a recent authenticated session.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudioShell>
  );
}
