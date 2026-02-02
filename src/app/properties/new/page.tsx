'use client'

import { useApp } from '@/contexts/AppContext'
import { PropertyForm } from '@/components/properties/PropertyForm'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewPropertyPage() {
  const { currentUser } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    } else if (currentUser.role !== 'landlord') {
      router.push('/browse')
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== 'landlord') return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Property Listing</h1>
          <p className="text-gray-600 mt-2">
            Add a new property to find your ideal tenant
          </p>
        </div>
        <PropertyForm />
      </div>
    </div>
  )
}
