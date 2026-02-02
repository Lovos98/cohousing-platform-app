'use client'

import { useApp } from '@/contexts/AppContext'
import { useTranslation } from '@/i18n'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import { haversineDistance } from '@/lib/geo'

// Dynamically import map to avoid SSR issues with Leaflet
const BrowseMap = dynamic(
  () => import('@/components/map/BrowseMap').then((mod) => mod.BrowseMap),
  { ssr: false }
)

export default function BrowsePage() {
  const { currentUser, properties } = useApp()
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('compatibility')

  // Map state - Default center: Hasselt, Belgium
  const [mapCenter, setMapCenter] = useState({ lat: 50.9307, lng: 5.3378 })
  const [searchRadius, setSearchRadius] = useState(5) // in kilometers

  // Filter properties with useMemo for performance
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Text search filter
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)

      if (!matchesSearch) return false

      // Geo-location filter
      const distance = haversineDistance(
        mapCenter.lat,
        mapCenter.lng,
        property.latitude,
        property.longitude
      )

      return distance <= searchRadius
    })
  }, [properties, searchQuery, mapCenter, searchRadius])

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      // Default: sort by compatibility (requires calculation)
      return 0
    })
  }, [filteredProperties, sortBy])

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.browse.title}</h1>
          <p className="text-gray-600">
            {t.browse.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.browse.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t.browse.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compatibility">{t.browse.sortOptions.compatibility}</SelectItem>
                <SelectItem value="price-low">{t.browse.sortOptions.priceLow}</SelectItem>
                <SelectItem value="price-high">{t.browse.sortOptions.priceHigh}</SelectItem>
                <SelectItem value="newest">{t.browse.sortOptions.newest}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vertical Layout: Map on top, Properties grid below */}
        <div className="flex flex-col gap-8">
          {/* Map - Full Width */}
          <div className="w-full">
            <BrowseMap
              properties={sortedProperties}
              mapCenter={mapCenter}
              searchRadius={searchRadius}
              onCenterChange={setMapCenter}
              onRadiusChange={setSearchRadius}
            />
          </div>

          {/* Results count */}
          <div>
            <p className="text-sm text-gray-600">
              {t.browse.showing} {sortedProperties.length}{' '}
              {sortedProperties.length === 1 ? t.browse.property : t.browse.properties}
            </p>
          </div>

          {/* Property Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currentUser={currentUser}
                showCompatibility={true}
              />
            ))}

            {sortedProperties.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t.browse.noResults}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
