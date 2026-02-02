'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PetPreference, SmokingPreference, UserPreferences } from '@/lib/types'

export function PropertyForm() {
  const router = useRouter()
  const { currentUser, createProperty } = useApp()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    bedrooms: '1',
    bathrooms: '1',
    images: '',
    amenities: '',
    availableFrom: '',
    preferences: {
      cleanliness: 3,
      noiseTolerance: 3,
      socialLevel: 3,
      pets: 'ok' as PetPreference,
      smoking: 'no' as SmokingPreference,
      overnight_guests: 3,
      shared_expenses: 3,
    } as UserPreferences,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    const imageUrls = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    const amenitiesList = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    createProperty({
      landlordId: currentUser.id,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      city: formData.city,
      address: formData.address,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      images: imageUrls,
      amenities: amenitiesList,
      availableFrom: formData.availableFrom,
      preferences: formData.preferences,
    })

    router.push('/properties')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Provide information about your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              placeholder="Modern Downtown Apartment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property, its features, and the neighborhood..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Rent ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="1500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, San Francisco, CA"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="37.7749"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-122.4194"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              placeholder="https://images.unsplash.com/photo-1..."
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Tip: Use free image services like Unsplash or Lorem Picsum
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              placeholder="WiFi, Dishwasher, Parking, Pet-friendly"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ideal Tenant Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Ideal Tenant Preferences</CardTitle>
          <CardDescription>
            Set your preferences to help us match you with compatible tenants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Cleanliness Level</Label>
              <span className="text-sm text-gray-600">{formData.preferences.cleanliness}/5</span>
            </div>
            <Slider
              value={[formData.preferences.cleanliness]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, cleanliness: value[0] },
                })
              }
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Noise Tolerance</Label>
              <span className="text-sm text-gray-600">{formData.preferences.noiseTolerance}/5</span>
            </div>
            <Slider
              value={[formData.preferences.noiseTolerance]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, noiseTolerance: value[0] },
                })
              }
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Social Level</Label>
              <span className="text-sm text-gray-600">{formData.preferences.socialLevel}/5</span>
            </div>
            <Slider
              value={[formData.preferences.socialLevel]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, socialLevel: value[0] },
                })
              }
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Overnight Guests</Label>
              <span className="text-sm text-gray-600">{formData.preferences.overnight_guests}/5</span>
            </div>
            <Slider
              value={[formData.preferences.overnight_guests]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, overnight_guests: value[0] },
                })
              }
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Shared Expenses</Label>
              <span className="text-sm text-gray-600">{formData.preferences.shared_expenses}/5</span>
            </div>
            <Slider
              value={[formData.preferences.shared_expenses]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, shared_expenses: value[0] },
                })
              }
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pets">Pet Preference</Label>
            <Select
              value={formData.preferences.pets}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, pets: value as PetPreference },
                })
              }
            >
              <SelectTrigger id="pets">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="love">Love Pets</SelectItem>
                <SelectItem value="ok">Pets OK</SelectItem>
                <SelectItem value="no">No Pets</SelectItem>
                <SelectItem value="allergic">Allergic to Pets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smoking">Smoking Preference</Label>
            <Select
              value={formData.preferences.smoking}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, smoking: value as SmokingPreference },
                })
              }
            >
              <SelectTrigger id="smoking">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Smoking OK</SelectItem>
                <SelectItem value="occasional">Occasional Only</SelectItem>
                <SelectItem value="no">No Smoking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        Create Property Listing
      </Button>
    </form>
  )
}
