"use client";
import { PasswordInput } from '@/components/shared/password-input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { signInSchema, totpSchema } from '@/contracts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
export function SignInForm() {
  const router = useRouter(); const [challenge,setChallenge] = useState(false); const [backup,setBackup] = useState(false); const [pending,setPending] = useState(false); const [error,setError] = useState('');
  async function submit(form: FormData) {
    setError(''); setPending(true);
    try {
      if (challenge) {
        const code = String(form.get('code') ?? '');
        if (!backup) { const parsed = totpSchema.safeParse({ code }); if (!parsed.success) { setError('Enter a six-digit authenticator code.'); return; } }
        const response = backup ? await authClient.twoFactor.verifyBackupCode({ code, trustDevice: false }) : await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
        if (response.error) { setError('The code could not be verified. Try again.'); return; }
        router.push('/studio'); router.refresh();
      } else {
        const parsed = signInSchema.safeParse({ email: form.get('email'), password: form.get('password') });
        if (!parsed.success) { setError('Enter a valid email and your password.'); return; }
        const response = await authClient.signIn.email({ ...parsed.data, rememberMe: form.get('rememberMe') === 'on' });
        if (response.error) { setError('Sign-in failed. Check your credentials or contact the developer.'); return; }
        if (response.data && 'twoFactorRedirect' in response.data && response.data.twoFactorRedirect) setChallenge(true);
        else { router.push('/studio'); router.refresh(); }
      }
    } catch { setError('Sign-in is unavailable. Contact the developer.'); }
    finally { setPending(false); }
  }
  return <form action={submit} autoComplete="on"><FieldGroup>{challenge ? <Field><FieldLabel htmlFor="code">{backup ? 'Recovery code' : 'Authenticator code'}</FieldLabel><Input id="code" name="code" autoComplete="one-time-code" inputMode={backup ? 'text' : 'numeric'} required aria-invalid={Boolean(error)} /></Field> : <><Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" name="email" type="email" autoComplete="username" maxLength={254} required /></Field><Field><FieldLabel htmlFor="password">Password</FieldLabel><PasswordInput id="password" name="password" autoComplete="current-password" maxLength={128} required /></Field><Field orientation="horizontal"><input id="rememberMe" name="rememberMe" type="checkbox" defaultChecked className="size-4 accent-primary" /><FieldLabel htmlFor="rememberMe">Keep me signed in</FieldLabel></Field></>}{error && <FieldError>{error}</FieldError>}<Button type="submit" disabled={pending}>{pending ? 'Checking…' : challenge ? 'Verify and sign in' : 'Sign in'}</Button>{challenge && <Button type="button" variant="ghost" onClick={() => { setBackup(!backup); setError(''); }}>{backup ? 'Use authenticator code' : 'Use a recovery code'}</Button>}</FieldGroup></form>;
}
