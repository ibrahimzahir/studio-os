"use client";
import { useState, type ComponentProps } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
export function PasswordInput(props: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false);
  return <InputGroup><InputGroupInput {...props} type={visible ? 'text' : 'password'} /><InputGroupAddon align="inline-end"><InputGroupButton type="button" size="icon-sm" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOffIcon /> : <EyeIcon />}</InputGroupButton></InputGroupAddon></InputGroup>;
}
