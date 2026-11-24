"use client";

import { useEffect, useState } from 'react';
import { MoreHorizontalIcon, ShieldCheckIcon, UserRoundIcon, WrenchIcon } from 'lucide-react';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['developer', 'staff', 'viewer']),
  status: z.enum(['active', 'suspended', 'blocked']),
  twoFactorEnabled: z.boolean(),
});

const stateSchema = z.object({
  users: z.array(userSchema),
  maintenance: z.boolean(),
});

type State = z.infer<typeof stateSchema>;
type Change =
  | { kind: 'account'; userId: string; name: string; status: 'active' | 'suspended' | 'blocked' }
  | { kind: 'maintenance'; value: boolean };

export function DeveloperControls() {
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState('');
  const [change, setChange] = useState<Change | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/users')
      .then(async (r) => {
        if (!r.ok) throw new Error('Account controls unavailable. Sign in again or retry.');
        return stateSchema.parse(await r.json());
      })
      .then((data) => {
        if (!ignore) setState(data);
      })
      .catch((e) => {
        if (!ignore) setError(e instanceof Error ? e.message : 'Could not load account controls.');
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function apply() {
    if (!change) return;
    setPending(true);
    try {
      const response = await fetch(
        change.kind === 'account'
          ? `/api/admin/users/${encodeURIComponent(change.userId)}/status`
          : '/api/admin/maintenance',
        {
          method: change.kind === 'account' ? 'PATCH' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            change.kind === 'account'
              ? { status: change.status }
              : {
                  maintenance: change.value,
                  message: 'The studio is undergoing maintenance. Please try again later.',
                },
          ),
        },
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(typeof result.error === 'string' ? result.error : 'Could not apply change.');
      }
      setState((current) =>
        current
          ? change.kind === 'account'
            ? {
                ...current,
                users: current.users.map((u) => (u.id === change.userId ? { ...u, status: change.status } : u)),
              }
            : { ...current, maintenance: change.value }
          : current,
      );
      setChange(null);
      toast.add({ title: 'Studio controls updated', type: 'success' });
    } catch (e) {
      toast.add({
        title: 'Change was not applied',
        description: e instanceof Error ? e.message : 'Try again.',
        type: 'error',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card id="administration" className="border-border/90 shadow-xs">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <ShieldCheckIcon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">Developer controls</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              Manage workspace maintenance mode and team account access.
            </CardDescription>
          </div>
        </div>
        {state && (
          <Badge variant={state.maintenance ? 'destructive' : 'secondary'} className="gap-1.5 font-medium">
            <span
              className={`size-1.5 rounded-full ${state.maintenance ? 'bg-current' : 'bg-primary'}`}
              aria-hidden="true"
            />
            {state.maintenance ? 'Maintenance active' : 'Workspace active'}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Controls unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !state ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* Maintenance Mode Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/30 px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground">
                  <WrenchIcon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Maintenance mode</p>
                    <Badge variant={state.maintenance ? 'secondary' : 'outline'} className="text-xs font-normal">
                      {state.maintenance ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {state.maintenance
                      ? 'Staff access is paused while developer access remains available.'
                      : 'Active team accounts can sign in normally.'}
                  </p>
                </div>
              </div>

              <Button
                variant={state.maintenance ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChange({ kind: 'maintenance', value: !state.maintenance })}
              >
                {state.maintenance ? 'Disable maintenance' : 'Enable maintenance'}
              </Button>
            </div>

            {/* Team Accounts List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <h3 className="text-sm font-semibold text-foreground">Team accounts</h3>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {state.users.length} {state.users.length === 1 ? 'member' : 'members'}
                </span>
              </div>

              <ul className="divide-y divide-border/70 rounded-xl border border-border/80 bg-card">
                {state.users.map((user) => (
                  <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <UserRoundIcon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                          <Badge variant="outline" className="text-[11px] font-normal capitalize text-muted-foreground">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5 capitalize">
                            <span
                              className={`size-1.5 rounded-full ${
                                user.status === 'active' ? 'bg-primary' : 'bg-destructive'
                              }`}
                              aria-hidden="true"
                            />
                            {user.status}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{user.twoFactorEnabled ? '2FA enabled' : '2FA required'}</span>
                        </div>
                      </div>
                    </div>

                    {user.role !== 'developer' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" aria-label={`Manage ${user.name}`} />}
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            {(['active', 'suspended', 'blocked'] as const).map((status) => (
                              <DropdownMenuItem
                                key={status}
                                disabled={user.status === status}
                                onClick={() => setChange({ kind: 'account', userId: user.id, name: user.name, status })}
                              >
                                {status === 'active' ? 'Enable' : status === 'suspended' ? 'Suspend' : 'Block'}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Confirmation Gate */}
        {change && (
          <Alert className="border-primary/30 bg-secondary/40">
            <AlertTitle className="text-sm font-semibold">
              {change.kind === 'account'
                ? `Set ${change.name} to ${change.status}?`
                : change.value
                  ? 'Enable maintenance mode?'
                  : 'Disable maintenance mode?'}
            </AlertTitle>
            <AlertDescription className="mt-1 space-y-3 text-xs">
              <p>
                {change.kind === 'account'
                  ? 'Existing sessions for this account will be revoked immediately.'
                  : change.value
                    ? 'Staff access will pause. Developer access remains available.'
                    : 'Staff access will resume for all active accounts.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={pending} onClick={() => void apply()}>
                  {pending ? 'Applying…' : 'Confirm change'}
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => setChange(null)}>
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
