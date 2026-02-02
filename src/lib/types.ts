// Core type definitions for the cohousing platform

export type UserRole = 'seeker' | 'landlord'
export type PetPreference = 'love' | 'ok' | 'no' | 'allergic'
export type SmokingPreference = 'yes' | 'no' | 'occasional'
export type MatchRequestStatus = 'pending' | 'accepted' | 'rejected'

export interface UserPreferences {
  cleanliness: number // 1-5 scale
  noiseTolerance: number // 1-5 scale
  socialLevel: number // 1-5 scale (1=very private, 5=very social)
  pets: PetPreference
  smoking: SmokingPreference
  overnight_guests: number // 1-5 scale
  shared_expenses: number // 1-5 scale (1=separate, 5=shared)
}

export interface User {
  id: string
  email: string
  password: string // In real app, this would be hashed
  name: string
  role: UserRole
  bio?: string
  age?: number
  occupation?: string
  avatar?: string
  preferences: UserPreferences
  createdAt: string
}

export interface Property {
  id: string
  landlordId: string
  title: string
  description: string
  price: number
  city: string
  address: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  images: string[]
  amenities: string[]
  preferences: UserPreferences // Landlord's ideal tenant preferences
  availableFrom: string
  createdAt: string
}

export interface MatchRequest {
  id: string
  seekerId: string
  propertyId: string
  landlordId: string
  message: string
  status: MatchRequestStatus
  compatibilityScore: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  matchRequestId: string
  content: string
  read: boolean
  createdAt: string
}

export interface CompatibilityBreakdown {
  overall: number
  categories: {
    cleanliness: number
    noiseTolerance: number
    socialLevel: number
    pets: number
    smoking: number
    overnight_guests: number
    shared_expenses: number
  }
}
