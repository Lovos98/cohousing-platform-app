'use client'

import { useApp } from '@/contexts/AppContext'
import { useTranslation } from '@/i18n'
import { MatchRequestCard } from '@/components/matching/MatchRequestCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MatchesPage() {
  const {
    currentUser,
    getMatchRequestsForSeeker,
    getMatchRequestsForLandlord,
    getUserById,
    getPropertyById,
    updateMatchRequestStatus,
  } = useApp()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  if (!currentUser) return null

  const isLandlord = currentUser.role === 'landlord'

  // Get requests based on user role
  const myRequests = isLandlord
    ? getMatchRequestsForLandlord(currentUser.id)
    : getMatchRequestsForSeeker(currentUser.id)

  const pendingRequests = myRequests.filter(mr => mr.status === 'pending')
  const acceptedRequests = myRequests.filter(mr => mr.status === 'accepted')
  const rejectedRequests = myRequests.filter(mr => mr.status === 'rejected')

  const handleAccept = (id: string) => {
    updateMatchRequestStatus(id, 'accepted')
  }

  const handleReject = (id: string) => {
    updateMatchRequestStatus(id, 'rejected')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLandlord ? t.matches.titleLandlord : t.matches.titleSeeker}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLandlord ? t.matches.subtitleLandlord : t.matches.subtitleSeeker}
          </p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              {t.matches.pending} ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              {t.matches.accepted} ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              {t.matches.rejected} ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">{t.matches.noPending}</p>
              </div>
            ) : (
              pendingRequests.map((request) => {
                const seeker = getUserById(request.seekerId)
                const property = getPropertyById(request.propertyId)
                if (!seeker || !property) return null

                return (
                  <MatchRequestCard
                    key={request.id}
                    matchRequest={request}
                    seeker={seeker}
                    property={property}
                    onAccept={isLandlord ? handleAccept : undefined}
                    onReject={isLandlord ? handleReject : undefined}
                    showActions={isLandlord}
                  />
                )
              })
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">{t.matches.noAccepted}</p>
              </div>
            ) : (
              acceptedRequests.map((request) => {
                const seeker = getUserById(request.seekerId)
                const property = getPropertyById(request.propertyId)
                if (!seeker || !property) return null

                return (
                  <MatchRequestCard
                    key={request.id}
                    matchRequest={request}
                    seeker={seeker}
                    property={property}
                  />
                )
              })
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">{t.matches.noRejected}</p>
              </div>
            ) : (
              rejectedRequests.map((request) => {
                const seeker = getUserById(request.seekerId)
                const property = getPropertyById(request.propertyId)
                if (!seeker || !property) return null

                return (
                  <MatchRequestCard
                    key={request.id}
                    matchRequest={request}
                    seeker={seeker}
                    property={property}
                  />
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
