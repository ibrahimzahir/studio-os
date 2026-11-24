"use client";
import { QRCodeSVG } from 'qrcode.react';
import { PasswordInput } from '@/components/shared/password-input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { totpSchema } from '@/contracts/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError, FieldDescription } from '@/components/ui/field';
export function TwoFactorSetup() {
  const router = useRouter(); const [setup,setSetup] = useState<{ totpURI: string; backupCodes: string[] } | null>(null); const [verified,setVerified] = useState(false); const [pending,setPending] = useState(false); const [error,setError] = useState('');
  async function submit(form: FormData) {
    setPending(true); setError('');
    try {
      if (!setup) {
        const response = await authClient.twoFactor.enable({ password: String(form.get('password') ?? '') });
        if (response.error || !response.data || !('totpURI' in response.data)) { setError('Could not start enrollment. Check your password or sign in again.'); return; }
        setSetup({ totpURI: response.data.totpURI, backupCodes: response.data.backupCodes });
      } else {
        const parsed = totpSchema.safeParse({ code: form.get('code') });
        if (!parsed.success) { setError('Enter a six-digit authenticator code.'); return; }
        const response = await authClient.twoFactor.verifyTotp({ code: parsed.data.code, trustDevice: false });
        if (response.error) { setError('Code not verified. Check your authenticator and try again.'); return; }
        setVerified(true);
      }
    } catch { setError('Two-factor setup is unavailable. Try again later.'); }
    finally { setPending(false); }
  }
  if (verified && setup) return <div className="flex flex-col gap-5"><p>Two-factor authentication is enabled. Store these recovery codes in your password manager before continuing. Each code can be used once.</p><pre className="rounded-lg bg-muted p-4 text-sm">{setup.backupCodes.join('\n')}</pre><Button onClick={() => { setSetup(null); router.push('/studio'); router.refresh(); }}>I saved my recovery codes</Button></div>;
  return <form action={submit}><FieldGroup>{setup ? <><div className="flex flex-col items-center gap-3"><p className="text-sm font-medium">Scan with your authenticator app</p><div className="rounded-xl bg-white p-4"><QRCodeSVG value={setup.totpURI} size={200} level="M" title="Studio OS authenticator enrollment QR code" /></div><p className="text-center text-xs text-muted-foreground">Google Authenticator, Microsoft Authenticator, 1Password or another TOTP app</p></div><details><summary className="cursor-pointer text-sm">Can’t scan? Enter a setup key</summary><Field className="mt-3"><FieldLabel htmlFor="secret">Authenticator setup key</FieldLabel><Input id="secret" readOnly value={new URL(setup.totpURI).searchParams.get('secret') ?? ''} /><FieldDescription>Add this key to your authenticator app as a time-based account named Studio OS. Keep it private.</FieldDescription></Field></details><Field><FieldLabel htmlFor="code">Six-digit confirmation code</FieldLabel><Input id="code" name="code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required /></Field></> : <Field><FieldLabel htmlFor="password">Confirm your password</FieldLabel><PasswordInput id="password" name="password" autoComplete="current-password" required /></Field>}{error && <FieldError>{error}</FieldError>}<Button disabled={pending} type="submit">{pending ? 'Checking…' : setup ? 'Verify authenticator' : 'Set up authenticator'}</Button></FieldGroup></form>;
}
