"use client";

import { usePathname } from 'next/navigation';
import {
  CalendarClockIcon,
  ChartNoAxesCombinedIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
  RadarIcon,
  ShieldCheckIcon,
  WorkflowIcon,
} from 'lucide-react';
import { AccountMenu } from '@/components/shared/account-menu';
import { StudioLogoMark } from '@/components/shared/studio-logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ preview = false, ...props }: React.ComponentProps<typeof Sidebar> & { preview?: boolean }) {
  const path = usePathname();
  const homeHref = preview ? '/preview' : '/studio';

  const groups = [
    {
      title: 'Studio',
      items: [
        { title: 'Overview', href: homeHref, icon: LayoutDashboardIcon },
        { title: 'Opportunity radar', href: '/studio/opportunities', icon: RadarIcon },
        { title: 'Production pipeline', href: '/studio/pipeline', icon: WorkflowIcon },
        { title: 'Marketing schedule', href: '/studio/marketing', icon: CalendarClockIcon },
      ],
    },
    {
      title: 'Operations',
      items: [
        { title: 'Analytics', href: '/studio/analytics', icon: ChartNoAxesCombinedIcon },
        { title: 'Health & backups', href: '/studio/operations', icon: HeartPulseIcon },
        { title: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
      ],
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-3 py-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href={homeHref} />} className="gap-3">
              <StudioLogoMark className="size-8 rounded-lg shadow-xs" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Studio OS</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {preview ? 'Sample workspace' : 'Private workspace'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groups.map((group) => (
          <SidebarGroup key={group.title} className="py-2">
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu className="mt-1 gap-0.5">
              {group.items.map((item) => {
                const active = path === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<a href={item.href} />}
                      className="h-9 gap-2.5 rounded-lg px-2.5 text-sm transition-colors duration-150"
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2.5">
        <AccountMenu preview={preview} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
