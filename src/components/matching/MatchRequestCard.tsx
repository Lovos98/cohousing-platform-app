'use client'

import { MatchRequest, User, Property } from '@/lib/types'
import { useTranslation } from '@/i18n'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCompatibilityColor } from '@/lib/compatibility'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface MatchRequestCardProps {
  matchRequest: MatchRequest
  seeker: User
  property: Property
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export function MatchRequestCard({
  matchRequest,
  seeker,
  property,
  onAccept,
  onReject,
  showActions = false,
}: MatchRequestCardProps) {
  const { t } = useTranslation()

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    accepted: <CheckCircle className="h-4 w-4" />,
    rejected: <XCircle className="h-4 w-4" />,
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-[#E8F5EF] text-[#2D7E5A]',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={seeker.avatar} />
              <AvatarFallback>{seeker.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{seeker.name}</CardTitle>
              <p className="text-sm text-gray-600">{seeker.occupation}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getCompatibilityColor(matchRequest.compatibilityScore)} border`}>
              {matchRequest.compatibilityScore}% Match
            </Badge>
            <Badge variant="secondary" className={statusColors[matchRequest.status]}>
              <span className="mr-1">{statusIcons[matchRequest.status]}</span>
              {matchRequest.status.charAt(0).toUpperCase() + matchRequest.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">{t.property.details}</h4>
          <Link href={`/properties/${property.id}`} className="text-[#2D7E5A] hover:underline">
            {property.title}
          </Link>
          <p className="text-sm text-gray-600">{property.city}</p>
        </div>

        <div>
          <h4 className="font-medium mb-1">Message</h4>
          <p className="text-sm text-gray-700">{matchRequest.message}</p>
        </div>

        {seeker.bio && (
          <div>
            <h4 className="font-medium mb-1">About</h4>
            <p className="text-sm text-gray-700">{seeker.bio}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Sent {new Date(matchRequest.createdAt).toLocaleDateString()}
        </div>
      </CardContent>

      {showActions && matchRequest.status === 'pending' && onAccept && onReject && (
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => onAccept(matchRequest.id)}
            className="flex-1 bg-[#2D7E5A] hover:bg-[#1F5A40]"
            variant="default"
          >
            {t.matches.accept}
          </Button>
          <Button
            onClick={() => onReject(matchRequest.id)}
            className="flex-1"
            variant="outline"
          >
            {t.matches.reject}
          </Button>
        </CardFooter>
      )}

      {matchRequest.status === 'accepted' && (
        <CardFooter>
          <Button asChild className="w-full bg-[#2D7E5A] hover:bg-[#1F5A40]">
            <Link href={`/messages?match=${matchRequest.id}`}>
              {t.matches.sendMessage}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
