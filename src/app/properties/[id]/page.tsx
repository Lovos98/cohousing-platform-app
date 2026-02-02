'use client'

import { useApp } from '@/contexts/AppContext'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CompatibilityScore } from '@/components/matching/CompatibilityScore'
import { calculateCompatibility } from '@/lib/compatibility'
import { MapPin, Bed, Bath, Calendar, DollarSign } from 'lucide-react'
import Image from 'next/image'

export default function PropertyDetailsPage() {
  const { currentUser, getPropertyById, getUserById, createMatchRequest, matchRequests } = useApp()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [message, setMessage] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const property = getPropertyById(propertyId)
  const landlord = property ? getUserById(property.landlordId) : null

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  useEffect(() => {
    if (currentUser && property) {
      // Check if user already sent a request for this property
      const existingRequest = matchRequests.find(
        mr => mr.seekerId === currentUser.id && mr.propertyId === property.id
      )
      if (existingRequest) {
        setRequestSent(true)
      }
    }
  }, [currentUser, property, matchRequests])

  if (!currentUser || !property || !landlord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Property not found</p>
      </div>
    )
  }

  const compatibility = calculateCompatibility(currentUser.preferences, property.preferences)
  const isOwnProperty = currentUser.id === property.landlordId

  const handleSendRequest = () => {
    if (!message.trim()) return

    createMatchRequest({
      seekerId: currentUser.id,
      propertyId: property.id,
      landlordId: property.landlordId,
      message: message.trim(),
      status: 'pending',
      compatibilityScore: compatibility.overall,
    })

    setRequestSent(true)
    setShowRequestForm(false)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {property.images[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative h-44 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{property.address}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ${property.price}/month
              </div>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span>Available {new Date(property.availableFrom).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>

                {property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Landlord Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {landlord.avatar && (
                      <img src={landlord.avatar} alt={landlord.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{landlord.name}</h4>
                    <p className="text-sm text-gray-600">{landlord.occupation}</p>
                  </div>
                </div>
                {landlord.bio && <p className="text-gray-700">{landlord.bio}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compatibility Score */}
            {!isOwnProperty && currentUser.role === 'seeker' && (
              <CompatibilityScore breakdown={compatibility} />
            )}

            {/* Match Request */}
            {!isOwnProperty && currentUser.role === 'seeker' && (
              <Card>
                <CardHeader>
                  <CardTitle>Interested in this property?</CardTitle>
                </CardHeader>
                <CardContent>
                  {requestSent ? (
                    <div className="text-center py-4">
                      <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-4">
                        <p className="font-medium">Request Sent!</p>
                        <p className="text-sm mt-1">
                          The landlord will review your request and get back to you soon.
                        </p>
                      </div>
                      <Button variant="outline" asChild className="w-full">
                        <a href="/matches">View My Requests</a>
                      </Button>
                    </div>
                  ) : showRequestForm ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Message to Landlord</Label>
                        <Textarea
                          id="message"
                          placeholder="Introduce yourself and explain why you're interested..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSendRequest} className="flex-1">
                          Send Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowRequestForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setShowRequestForm(true)} className="w-full">
                      Send Match Request
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {isOwnProperty && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600 mb-4">This is your property</p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/matches">View Match Requests</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
