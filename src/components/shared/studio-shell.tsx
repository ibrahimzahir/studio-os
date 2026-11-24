"use client";

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const routeTitles: Record<string, string> = {
  '/studio': 'Overview',
  '/preview': 'Sample workspace',
  '/studio/opportunities': 'Opportunity radar',
  '/studio/pipeline': 'Production pipeline',
  '/studio/marketing': 'Marketing schedule',
  '/studio/analytics': 'Analytics',
  '/studio/operations': 'Health & backups',
  '/settings/security': 'Security',
};

export function StudioShell({ children, preview = false }: { children: React.ReactNode; preview?: boolean }) {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? 'Workspace';
  const isHome = pathname === '/studio' || pathname === '/preview';

  return (
    <SidebarProvider>
      <AppSidebar preview={preview} />
      <SidebarInset className="min-w-0 overflow-x-clip bg-background">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md md:px-7">
          <div className="flex min-w-0 items-center gap-2.5">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {!isHome && (
                  <>
                    <BreadcrumbItem className="hidden sm:inline-flex">
                      <BreadcrumbLink render={<a href={preview ? '/preview' : '/studio'} />}>
                        Studio OS
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:inline-flex" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-foreground">
                    {preview ? 'Sample dashboard' : title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
