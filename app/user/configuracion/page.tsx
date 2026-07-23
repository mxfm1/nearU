'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { ConfigHeader } from './_components/config-header'
import { AccountSection } from './_components/account-section'
import { PrivacySection } from './_components/privacy-section'
import { NotificationsSection } from './_components/notifications-section'
import type { EmailNotifications, PushNotifications } from './_components/notifications-section'
import { SecuritySection } from './_components/security-section'
import { DangerZone } from './_components/danger-zone'

export default function ConfiguracionPage() {
  const { user, loading, login, register, logout } = useAuth()

  const [profileVisibility, setProfileVisibility] = useState<'public' | 'followers'>('public')
  const [shareData, setShareData] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState<EmailNotifications>({
    newEvents: true,
    quotes: true,
    authorize: true,
  })
  const [pushNotifications, setPushNotifications] = useState<PushNotifications>({
    reminders: true,
  })

  if (loading || !user) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ConfigHeader userImage={user.image} userName={user.name} />

        <div className="space-y-8">
          <AccountSection user={user} />
          {/* <PrivacySection
            profileVisibility={profileVisibility}
            onProfileVisibilityChange={setProfileVisibility}
            shareData={shareData}
            onShareDataChange={setShareData}
          /> */}
          {/* <NotificationsSection
            emailNotifications={emailNotifications}
            onEmailNotificationsChange={setEmailNotifications}
            pushNotifications={pushNotifications}
            onPushNotificationsChange={setPushNotifications}
          /> */}
          <SecuritySection />
          <DangerZone user={user} />
        </div>
      </div>
    </div>
  )
}
