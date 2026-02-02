'use client'

import { useApp } from '@/contexts/AppContext'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { currentUser } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your information and preferences
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  )
}
