"use client";
import { useTheme } from 'next-themes';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return <ToggleGroup aria-label="Color theme" value={mounted && theme ? [theme] : []} onValueChange={values => { if (values[0]) setTheme(String(values[0])); }} variant="outline" size="sm"><ToggleGroupItem value="light" aria-label="Light theme"><SunIcon /></ToggleGroupItem><ToggleGroupItem value="dark" aria-label="Dark theme"><MoonIcon /></ToggleGroupItem><ToggleGroupItem value="system" aria-label="System theme"><MonitorIcon /></ToggleGroupItem></ToggleGroup>;
}
