'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PetPreference, SmokingPreference } from '@/lib/types'

export function ProfileForm() {
  const { currentUser, updateUserProfile } = useApp()
  const [saving, setSaving] = useState(false)

  if (!currentUser) return null

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    bio: currentUser.bio || '',
    age: currentUser.age || '',
    occupation: currentUser.occupation || '',
    preferences: { ...currentUser.preferences },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    updateUserProfile({
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
    })
    setTimeout(() => setSaving(false), 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell others about yourself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your interests, lifestyle..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Preferences</CardTitle>
          <CardDescription>
            Help us find your perfect {currentUser.role === 'seeker' ? 'home' : 'tenant'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cleanliness */}
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Relaxed</span>
              <span>Very Tidy</span>
            </div>
          </div>

          {/* Noise Tolerance */}
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Quiet</span>
              <span>High Tolerance</span>
            </div>
          </div>

          {/* Social Level */}
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Private</span>
              <span>Very Social</span>
            </div>
          </div>

          {/* Overnight Guests */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Overnight Guests Frequency</Label>
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Rarely</span>
              <span>Often</span>
            </div>
          </div>

          {/* Shared Expenses */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Shared Expenses Preference</Label>
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Keep Separate</span>
              <span>Share Everything</span>
            </div>
          </div>

          {/* Pets */}
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

          {/* Smoking */}
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

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
