'use client'

import { useApp } from '@/contexts/AppContext'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function MyPropertiesPage() {
  const { currentUser, getPropertiesByLandlord } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    } else if (currentUser.role !== 'landlord') {
      router.push('/browse')
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== 'landlord') return null

  const myProperties = getPropertiesByLandlord(currentUser.id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-2">
              Manage your property listings
            </p>
          </div>
          <Button asChild>
            <Link href="/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {myProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first property listing to start finding tenants
            </p>
            <Button asChild>
              <Link href="/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                showCompatibility={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
