'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Property, MatchRequest, Message, UserPreferences } from '@/lib/types'
import { mockUsers, mockProperties, mockMatchRequests, mockMessages } from '@/lib/mockData'

interface AppContextType {
  // Authentication
  currentUser: User | null
  login: (email: string, password: string) => boolean
  signup: (email: string, password: string, name: string, role: 'seeker' | 'landlord') => boolean
  logout: () => void
  updateUserProfile: (updates: Partial<User>) => void

  // Users
  users: User[]
  getUserById: (id: string) => User | undefined

  // Properties
  properties: Property[]
  createProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void
  getPropertyById: (id: string) => Property | undefined
  getPropertiesByLandlord: (landlordId: string) => Property[]

  // Match Requests
  matchRequests: MatchRequest[]
  createMatchRequest: (request: Omit<MatchRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateMatchRequestStatus: (id: string, status: 'accepted' | 'rejected') => void
  getMatchRequestsForSeeker: (seekerId: string) => MatchRequest[]
  getMatchRequestsForLandlord: (landlordId: string) => MatchRequest[]
  getMatchRequestById: (id: string) => MatchRequest | undefined

  // Messages
  messages: Message[]
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void
  getMessagesForMatchRequest: (matchRequestId: string) => Message[]
  markMessagesAsRead: (matchRequestId: string, userId: string) => void
  getUnreadCount: (userId: string) => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>(mockMatchRequests)
  const [messages, setMessages] = useState<Message[]>(mockMessages)

  // Load current user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId')
    if (storedUserId) {
      const user = users.find(u => u.id === storedUserId)
      if (user) setCurrentUser(user)
    }
  }, [])

  // Authentication functions
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUserId', user.id)
      return true
    }
    return false
  }

  const signup = (email: string, password: string, name: string, role: 'seeker' | 'landlord'): boolean => {
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return false
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role,
      preferences: {
        cleanliness: 3,
        noiseTolerance: 3,
        socialLevel: 3,
        pets: 'ok',
        smoking: 'no',
        overnight_guests: 3,
        shared_expenses: 3,
      },
      createdAt: new Date().toISOString(),
    }

    setUsers([...users, newUser])
    setCurrentUser(newUser)
    localStorage.setItem('currentUserId', newUser.id)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUserId')
  }

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
  }

  // User functions
  const getUserById = (id: string) => users.find(u => u.id === id)

  // Property functions
  const createProperty = (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setProperties([newProperty, ...properties])
  }

  const getPropertyById = (id: string) => properties.find(p => p.id === id)

  const getPropertiesByLandlord = (landlordId: string) =>
    properties.filter(p => p.landlordId === landlordId)

  // Match Request functions
  const createMatchRequest = (request: Omit<MatchRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: MatchRequest = {
      ...request,
      id: `match-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMatchRequests([newRequest, ...matchRequests])
  }

  const updateMatchRequestStatus = (id: string, status: 'accepted' | 'rejected') => {
    setMatchRequests(matchRequests.map(mr =>
      mr.id === id ? { ...mr, status, updatedAt: new Date().toISOString() } : mr
    ))
  }

  const getMatchRequestsForSeeker = (seekerId: string) =>
    matchRequests.filter(mr => mr.seekerId === seekerId)

  const getMatchRequestsForLandlord = (landlordId: string) =>
    matchRequests.filter(mr => mr.landlordId === landlordId)

  const getMatchRequestById = (id: string) =>
    matchRequests.find(mr => mr.id === id)

  // Message functions
  const sendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setMessages([...messages, newMessage])
  }

  const getMessagesForMatchRequest = (matchRequestId: string) =>
    messages.filter(m => m.matchRequestId === matchRequestId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const markMessagesAsRead = (matchRequestId: string, userId: string) => {
    setMessages(messages.map(m =>
      m.matchRequestId === matchRequestId && m.receiverId === userId
        ? { ...m, read: true }
        : m
    ))
  }

  const getUnreadCount = (userId: string) =>
    messages.filter(m => m.receiverId === userId && !m.read).length

  const value: AppContextType = {
    currentUser,
    login,
    signup,
    logout,
    updateUserProfile,
    users,
    getUserById,
    properties,
    createProperty,
    getPropertyById,
    getPropertiesByLandlord,
    matchRequests,
    createMatchRequest,
    updateMatchRequestStatus,
    getMatchRequestsForSeeker,
    getMatchRequestsForLandlord,
    getMatchRequestById,
    messages,
    sendMessage,
    getMessagesForMatchRequest,
    markMessagesAsRead,
    getUnreadCount,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
