'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Key } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const nameSchema = z.object({ name: z.string().min(1, 'Nombre requerido') })
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requerido'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
})

type NameForm = z.infer<typeof nameSchema>
type PasswordForm = z.infer<typeof passwordSchema>

type Profile = {
  name: string
  email: string
  role: string
  title: string
  bio: string
  timezone: string
  language: string
  mfa: boolean
  loginAlerts: boolean
  emailProduct: boolean
  emailWeekly: boolean
  emailMentions: boolean
  emailBilling: boolean
}

const TABS = [
  { k: 'general', l: 'General' },
  { k: 'security', l: 'Security' },
  { k: 'notifications', l: 'Notifications' },
  { k: 'api', l: 'API keys' },
]

const API_KEYS = [
  { n: 'Production', k: 'sk_live_••••••••••••••••a12f', used: '2m ago' },
  { n: 'Staging', k: 'sk_test_••••••••••••••••88c1', used: '2 days ago' },
  { n: 'CI/CD', k: 'sk_live_••••••••••••••••0d4b', used: '1 week ago' },
]

const NOTIF_ITEMS: [keyof Profile, string, string][] = [
  ['emailProduct', 'Product updates', 'News, features and announcements.'],
  ['emailWeekly', 'Weekly digest', 'A summary of your workspace activity.'],
  ['emailMentions', 'Mentions', 'When someone mentions you in a post or comment.'],
  ['emailBilling', 'Billing & usage', 'Invoices and usage limit warnings.'],
]

export default function ProfileClient({
  name,
  email,
  role,
}: {
  name: string
  email: string
  role: string
}) {
  const [tab, setTab] = useState('general')
  const [profile, setProfile] = useState<Profile>({
    name,
    email,
    role,
    title: 'Head of Product',
    bio: 'Building tools that make teams move faster.',
    timezone: 'America/New_York',
    language: 'en',
    mfa: true,
    loginAlerts: true,
    emailProduct: true,
    emailWeekly: true,
    emailMentions: true,
    emailBilling: false,
  })
  const [dirty, setDirty] = useState(false)

  const update = (patch: Partial<Profile>) => {
    setProfile((f) => ({ ...f, ...patch }))
    setDirty(true)
  }

  const nameForm = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const save = async () => {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name }),
    })
    setDirty(false)
    toast.success('Profile saved')
  }

  const discard = () => {
    setProfile((p) => ({ ...p, name, email, role }))
    nameForm.reset({ name })
    setDirty(false)
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    })
    if (!res.ok) {
      const json = await res.json()
      toast.error(json.error ?? 'Error al cambiar password')
      return
    }
    passwordForm.reset()
    toast.success('Password updated')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile & settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and workspace preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border -mx-1">
        <div className="flex gap-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                'px-3 py-2 text-sm border-b-2 -mb-px transition-colors',
                tab === t.k
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* General */}
      {tab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>How others will see you in the workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar name={profile.name} size={80} />
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label>Full name</Label>
                    <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} disabled className="opacity-60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Job title</Label>
                    <Input value={profile.title} onChange={(e) => update({ title: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label>Bio</Label>
                    <Textarea rows={3} value={profile.bio} onChange={(e) => update({ bio: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace</CardTitle>
              <CardDescription>Preferences for this workspace only.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onChange={(e) => update({ timezone: e.target.value })}>
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Europe/Madrid</option>
                    <option>Asia/Tokyo</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <Select value={profile.language} onChange={(e) => update({ language: e.target.value })}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="text-base text-red-600">Danger zone</CardTitle>
              <CardDescription>Irreversible and destructive actions.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Delete account</div>
                <div className="text-xs text-muted-foreground">
                  Permanently remove your account and all associated data.
                </div>
              </div>
              <Button variant="destructive" size="sm">Delete account</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
            <CardDescription>Protect your account with strong credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="font-medium text-sm">Two-factor authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security.</div>
              </div>
              <Switch checked={profile.mfa} onChange={(v) => update({ mfa: v })} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="font-medium text-sm">Email notifications for logins</div>
                <div className="text-xs text-muted-foreground">Get notified when someone signs in.</div>
              </div>
              <Switch checked={profile.loginAlerts} onChange={(v) => update({ loginAlerts: v })} />
            </div>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label>Current password</Label>
                <Input type="password" placeholder="••••••••" {...passwordForm.register('currentPassword')} />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <Input type="password" placeholder="••••••••" {...passwordForm.register('newPassword')} />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <Button type="submit" size="sm">Update password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Choose what you want to hear about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {NOTIF_ITEMS.map(([k, l, d]) => (
              <div key={k} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-sm">{l}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
                <Switch
                  checked={!!profile[k]}
                  onChange={(v) => update({ [k]: v } as Partial<Profile>)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* API keys */}
      {tab === 'api' && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">API keys</CardTitle>
              <CardDescription>Tokens used to authenticate API requests.</CardDescription>
            </div>
            <Button size="sm" onClick={() => toast('Feature coming soon')}>
              <Plus className="h-3.5 w-3.5" />Create key
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-border">
              {API_KEYS.map((r, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-border last:border-0">
                  <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{r.n}</div>
                    <div className="text-xs font-mono text-muted-foreground truncate">{r.k}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Last used {r.used}</div>
                  <Button variant="outline" size="sm" onClick={() => toast('Key revoked')}>Revoke</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unsaved changes bar */}
      {dirty && (
        <div className="sticky bottom-4 z-20 flex justify-end">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg">
            <span className="text-xs text-muted-foreground">You have unsaved changes</span>
            <Button variant="ghost" size="sm" onClick={discard}>Discard</Button>
            <Button size="sm" onClick={save}>Save changes</Button>
          </div>
        </div>
      )}
    </div>
  )
}
