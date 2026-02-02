'use client'

import { useApp } from '@/contexts/AppContext'
import { ChatWindow } from '@/components/messages/ChatWindow'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { MessageSquare } from 'lucide-react'

function MessagesContent() {
  const {
    currentUser,
    matchRequests,
    getUserById,
    getPropertyById,
    messages,
    getMatchRequestById,
  } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  useEffect(() => {
    // Check URL param for match ID
    const matchParam = searchParams.get('match')
    if (matchParam) {
      setSelectedMatchId(matchParam)
    }
  }, [searchParams])

  if (!currentUser) return null

  // Get all accepted match requests for current user
  const acceptedMatches = matchRequests.filter(
    mr =>
      mr.status === 'accepted' &&
      (mr.seekerId === currentUser.id || mr.landlordId === currentUser.id)
  )

  // Get unread counts per match
  const getUnreadCount = (matchRequestId: string) => {
    return messages.filter(
      m => m.matchRequestId === matchRequestId && m.receiverId === currentUser.id && !m.read
    ).length
  }

  const selectedMatch = selectedMatchId ? getMatchRequestById(selectedMatchId) : null
  const otherUser = selectedMatch
    ? getUserById(
        selectedMatch.seekerId === currentUser.id
          ? selectedMatch.landlordId
          : selectedMatch.seekerId
      )
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Chat with your matches
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Conversations</h2>
              <div className="space-y-2">
                {acceptedMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  acceptedMatches.map((match) => {
                    const otherUserId =
                      match.seekerId === currentUser.id
                        ? match.landlordId
                        : match.seekerId
                    const user = getUserById(otherUserId)
                    const property = getPropertyById(match.propertyId)
                    const unreadCount = getUnreadCount(match.id)

                    if (!user || !property) return null

                    return (
                      <button
                        key={match.id}
                        onClick={() => setSelectedMatchId(match.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedMatchId === match.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{user.name}</p>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2 px-2 py-0.5 text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {property.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedMatch && otherUser ? (
              <ChatWindow matchRequest={selectedMatch} otherUser={otherUser} />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading messages...</p>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}
