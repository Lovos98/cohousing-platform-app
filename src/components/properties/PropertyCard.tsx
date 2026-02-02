'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Property, User } from '@/lib/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Calendar } from 'lucide-react'
import { calculateCompatibility, getCompatibilityColor, getCompatibilityLabel } from '@/lib/compatibility'

interface PropertyCardProps {
  property: Property
  currentUser?: User | null
  showCompatibility?: boolean
}

export function PropertyCard({ property, currentUser, showCompatibility = true }: PropertyCardProps) {
  const compatibility = currentUser && showCompatibility
    ? calculateCompatibility(currentUser.preferences, property.preferences)
    : null

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-200">
          {property.images[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {compatibility && (
            <div className="absolute top-3 right-3">
              <Badge className={`${getCompatibilityColor(compatibility.overall)} bg-white border-2`}>
                {compatibility.overall}% Match
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <div className="bg-[#2D7E5A] text-white px-3 py-1 rounded-lg font-bold">
              ${property.price}/mo
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.city}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{property.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms} bed
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} bath
            </div>
          </div>
        </CardContent>

        {compatibility && (
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="w-full text-sm">
              <p className={`font-medium ${getCompatibilityColor(compatibility.overall)}`}>
                {getCompatibilityLabel(compatibility.overall)}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
