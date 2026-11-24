"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronsUpDownIcon, LogInIcon, LogOutIcon, ShieldCheckIcon, UserRoundIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { toast } from '@/components/ui/toast';
import { authClient } from '@/lib/auth-client';

export function AccountMenu({ preview = false }: { preview?: boolean }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session } = authClient.useSession();
  const [pending, setPending] = useState(false);
  const name = preview ? 'Studio preview' : session?.user.name ?? 'Your account';
  const subtitle = preview ? 'Sample workspace' : session?.user.email ?? 'Private workspace';

  async function signOut() {
    setPending(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error();
      router.push('/sign-in');
      router.refresh();
    } catch {
      toast.add({ title: 'Sign-out failed', description: 'Try again.', type: 'error' });
    } finally {
      setPending(false);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" aria-label="Open account menu" disabled={pending} />}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
              <UserRoundIcon className="size-5" />
            </span>
            <span className="grid min-w-0 flex-1 gap-1 text-left">
              <span className="truncate text-sm font-semibold">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
            </span>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="end" sideOffset={8} className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block py-2">
                  <span className="block text-sm font-semibold text-foreground">{name}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{subtitle}</span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {!preview && (
                <DropdownMenuItem render={<a href="/settings/security" />}>
                  <ShieldCheckIcon />
                  Account &amp; security
                </DropdownMenuItem>
              )}
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {preview ? (
                <DropdownMenuItem render={<a href="/sign-in" />}>
                  <LogInIcon />
                  Sign in
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled={pending} onClick={() => void signOut()}>
                  <LogOutIcon />
                  {pending ? 'Signing out…' : 'Sign out'}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
