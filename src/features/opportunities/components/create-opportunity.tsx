"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, ArrowUpRightIcon } from 'lucide-react';
import { createOpportunitySchema } from '@/contracts/opportunities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

export function CreateOpportunity({ preview = false, prominent = false }: { preview?: boolean; prominent?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState('');
  async function submit(form: FormData) {
    setFailure('');
    const parsed = createOpportunitySchema.safeParse(Object.fromEntries(['title','audience','category'].map(key => [key, form.get(key)])));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      return;
    }
    setErrors({}); setPending(true);
    try {
      const response = await fetch('/api/opportunities', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(parsed.data) });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(typeof body.error === 'string' ? body.error : 'Could not save the opportunity.');
      }
      setOpen(false); router.refresh();
      toast.add({ title:'Opportunity added', description:'Ready for research. Production has not started.', type:'success' });
    } catch(error) { setFailure(error instanceof Error ? error.message : 'Could not save. Try again.'); }
    finally { setPending(false); }
  }
  if (preview) return <Button variant={prominent ? 'secondary' : 'default'} nativeButton={false} render={<a href="/sign-in" />}><PlusIcon data-icon="inline-start" />Add opportunity<ArrowUpRightIcon data-icon="inline-end" /></Button>;
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button variant={prominent ? 'secondary' : 'default'} />}><PlusIcon data-icon="inline-start" />Add opportunity</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Capture an opportunity</DialogTitle><DialogDescription>Start with a customer problem. Validate demand before production.</DialogDescription></DialogHeader><form action={submit} noValidate className="pt-4"><FieldGroup><Field data-invalid={Boolean(errors.title)}><FieldLabel htmlFor="idea-title">Product idea</FieldLabel><Input id="idea-title" name="title" placeholder="e.g. Mobile detailing planner" maxLength={160} aria-invalid={Boolean(errors.title)} />{errors.title && <FieldError>{errors.title}</FieldError>}</Field><Field data-invalid={Boolean(errors.audience)}><FieldLabel htmlFor="idea-audience">Who is it for?</FieldLabel><Input id="idea-audience" name="audience" placeholder="e.g. Independent mobile detailers" maxLength={500} aria-invalid={Boolean(errors.audience)} /><FieldDescription>A specific buyer makes research more useful.</FieldDescription>{errors.audience && <FieldError>{errors.audience}</FieldError>}</Field><Field><FieldLabel htmlFor="idea-category">Category</FieldLabel><NativeSelect id="idea-category" name="category" defaultValue="operations"><NativeSelectOption value="operations">Business operations</NativeSelectOption><NativeSelectOption value="hospitality">Hospitality</NativeSelectOption><NativeSelectOption value="events">Events</NativeSelectOption></NativeSelect></Field>{failure && <FieldError>{failure}</FieldError>}<Button type="submit" disabled={pending}>{pending?'Saving…':'Save opportunity'}</Button></FieldGroup></form></DialogContent></Dialog>;
}
